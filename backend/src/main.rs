use axum::{
    extract::{State, Path},
    routing::{get, post},
    Json, Router, http::StatusCode,
};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, Pool, Postgres, FromRow};
use dotenvy::dotenv;
use std::env;
use uuid::Uuid;
use tower_http::cors::{CorsLayer, Any};
use bcrypt::{hash, verify, DEFAULT_COST};

// --- MODELS ---

// 1. Dashboard Summary
#[derive(Serialize)]
pub struct DashboardSummary {
    pub greeting: String,
    pub widgets: WidgetData,
}

#[derive(Serialize)]
pub struct WidgetData {
    pub tasks: TaskSummary,
}

#[derive(Serialize)]
pub struct TaskSummary {
    pub pending_count: i64,
    pub recent_tasks: Vec<TaskItem>,
}

#[derive(Serialize, FromRow)]
pub struct TaskItem {
    pub id: Uuid,
    pub title: String,
    pub is_done: bool,
    pub priority: Option<String>,
}

// 2. Auth Models
#[derive(Debug, Deserialize)]
pub struct AuthPayload {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub message: String,
    pub status: String,
}

// 3. Task Creation Model
#[derive(Deserialize)]
pub struct CreateTaskPayload {
    pub title: String,
    pub priority: String,
}

// --- STATE ---
#[derive(Clone)]
struct AppState {
    db: Pool<Postgres>,
}

// --- MAIN ---
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv().ok();
    
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;
        
    println!("✅ CyberMe Brain Connected!");

    let state = AppState { db: pool };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(health_check))
        // Auth
        .route("/register", post(register_user))
        .route("/login", post(login_user))
        // Dashboard
        .route("/dashboard/summary", get(get_dashboard_summary))
        // Tasks (Interactive)
        .route("/tasks", post(create_task))
        .route("/tasks/:id", post(toggle_task))
        .with_state(state)
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await?;
    println!("🚀 CyberMe Server running on http://127.0.0.1:3000");
    
    axum::serve(listener, app).await?;

    Ok(())
}

// --- HANDLERS ---

async fn health_check() -> &'static str {
    "CyberMe Systems Operational."
}

async fn get_dashboard_summary(
    State(state): State<AppState>,
) -> Result<Json<DashboardSummary>, (StatusCode, String)> {
    
    // 1. Get Task Stats
    let task_count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM tasks WHERE is_done = false")
        .fetch_one(&state.db).await.unwrap_or((0,));

    // 2. Get Top 3 Recent Tasks
    let recent_tasks: Vec<TaskItem> = sqlx::query_as(
        "SELECT id, title, is_done, priority FROM tasks ORDER BY created_at DESC LIMIT 3"
    )
    .fetch_all(&state.db).await.unwrap_or(vec![]);

    // 3. Assemble Response
    let summary = DashboardSummary {
        greeting: "Welcome back, System Admin.".to_string(),
        widgets: WidgetData {
            tasks: TaskSummary {
                pending_count: task_count.0,
                recent_tasks: recent_tasks,
            }
        }
    };

    Ok(Json(summary))
}

// Auth Handlers
async fn register_user(State(state): State<AppState>, Json(payload): Json<AuthPayload>) -> Result<Json<AuthResponse>, (StatusCode, String)> {
    let hashed = hash(payload.password, DEFAULT_COST).map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    sqlx::query("INSERT INTO users (username, password) VALUES ($1, $2)")
        .bind(payload.username).bind(hashed)
        .execute(&state.db).await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB Error: {}", e)))?;
    Ok(Json(AuthResponse { message: "User created".to_string(), status: "success".to_string() }))
}

async fn login_user(State(state): State<AppState>, Json(payload): Json<AuthPayload>) -> Result<Json<AuthResponse>, (StatusCode, String)> {
    let stored: (String,) = sqlx::query_as("SELECT password FROM users WHERE username = $1")
        .bind(payload.username).fetch_one(&state.db).await
        .map_err(|_| (StatusCode::UNAUTHORIZED, "Account not found".to_string()))?;
    if verify(payload.password, &stored.0).unwrap_or(false) {
        Ok(Json(AuthResponse { message: "Login successful".to_string(), status: "success".to_string() }))
    } else {
        Err((StatusCode::UNAUTHORIZED, "Wrong password".to_string()))
    }
}

// Task Handlers (Interactive)
async fn create_task(
    State(state): State<AppState>,
    Json(payload): Json<CreateTaskPayload>,
) -> Result<Json<TaskItem>, (StatusCode, String)> {
    let row: TaskItem = sqlx::query_as(
        "INSERT INTO tasks (title, priority) VALUES ($1, $2) RETURNING id, title, is_done, priority"
    )
    .bind(payload.title)
    .bind(payload.priority)
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(row))
}

async fn toggle_task(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<String>, (StatusCode, String)> {
    sqlx::query("UPDATE tasks SET is_done = NOT is_done WHERE id = $1")
        .bind(id)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json("Task updated".to_string()))
}
