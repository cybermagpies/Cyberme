use axum::{
    extract::{State},
    routing::{get, post},
    Json, Router, http::StatusCode,
};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, Pool, Postgres, FromRow};
use dotenvy::dotenv;
use std::env;
use uuid::Uuid;
use chrono::NaiveDate;
use tower_http::cors::{CorsLayer, Any};
// --- 1. DATA MODELS ---
#[derive(Debug, Serialize, FromRow)]
pub struct DailyLog {
    pub id: Uuid,
    pub date: NaiveDate,
    pub entry_type: String,
    pub mood: Option<String>,
    pub content: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateLogPayload {
    pub date: NaiveDate,
    pub entry_type: String,
    pub mood: Option<String>,
    pub content: String,
}

// --- 2. APP STATE ---
#[derive(Clone)]
struct AppState {
    db: Pool<Postgres>,
}

// --- 3. MAIN SERVER ---
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv().ok();
    
    // Connect to Database
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    println!("🔌 Connecting to Database...");
    
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;
        
    println!("✅ CyberMe Brain Connected!");

    let state = AppState { db: pool };

    // Define API Routes
// ... inside main() ...

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(health_check))
        .route("/logs", post(create_log).get(get_recent_logs))
        .with_state(state)
        .layer(cors);  // <--- THIS LINE IS CRITICAL

    // Start Server (Updated for Axum 0.7)
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await?;
    println!("🚀 CyberMe Server running on http://127.0.0.1:3000");
    
    axum::serve(listener, app).await?;

    Ok(())
}

// --- 4. API HANDLERS ---

async fn health_check() -> &'static str {
    "CyberMe Systems Operational."
}

async fn create_log(
    State(state): State<AppState>,
    Json(payload): Json<CreateLogPayload>,
) -> Result<Json<DailyLog>, (StatusCode, String)> {
    
    let query = "
        INSERT INTO daily_logs (date, entry_type, mood, content)
        VALUES ($1, $2, $3, $4)
        RETURNING id, date, entry_type, mood, content
    ";

    let rec: DailyLog = sqlx::query_as(query)
        .bind(payload.date)
        .bind(payload.entry_type)
        .bind(payload.mood)
        .bind(payload.content)
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(rec))
}

async fn get_recent_logs(
    State(state): State<AppState>,
) -> Result<Json<Vec<DailyLog>>, (StatusCode, String)> {
    
    let query = "
        SELECT id, date, entry_type, mood, content 
        FROM daily_logs 
        ORDER BY date DESC 
        LIMIT 10
    ";

    let logs: Vec<DailyLog> = sqlx::query_as(query)
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(logs))
}
