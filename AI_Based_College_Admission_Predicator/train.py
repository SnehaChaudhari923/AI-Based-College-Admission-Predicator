import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import pickle
import os

def train_ug_model():
    """Train UG admission prediction model"""
    print("="*50)
    print("Training UG Model...")
    print("="*50)
    
    # Create synthetic dataset
    np.random.seed(42)
    n_samples = 10000
    
    # Generate synthetic data
    board_percentages = np.random.uniform(50, 100, n_samples)
    entrance_scores = np.random.uniform(100, 360, n_samples)
    extracurricular = np.random.uniform(3, 10, n_samples)
    
    # Create target with realistic pattern
    admission_chance = (
        0.35 * (board_percentages) + 
        0.35 * (entrance_scores / 360 * 100) + 
        0.20 * (extracurricular * 10) +
        np.random.normal(0, 5, n_samples)
    )
    admission_chance = np.clip(admission_chance, 0, 100)
    
    X = np.column_stack([board_percentages, entrance_scores, extracurricular])
    y = admission_chance
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train model
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    
    print("Training Random Forest with 100 estimators...")
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    print(f"UG Model Performance:")
    print(f"  R² Score: {r2:.3f}")
    print(f"  RMSE: {rmse:.3f}")
    
    # Save model
    with open('ug_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    print("UG model saved as 'ug_model.pkl'")
    
    return model

def train_pg_model():
    """Train PG admission prediction model"""
    print("\n" + "="*50)
    print("Training PG Model...")
    print("="*50)
    
    # Create synthetic dataset
    np.random.seed(42)
    n_samples = 10000
    
    # Generate synthetic data
    gre_scores = np.random.uniform(290, 340, n_samples)
    toefl_scores = np.random.uniform(90, 120, n_samples)
    uni_ratings = np.random.uniform(1, 5, n_samples)
    sop = np.random.uniform(1, 5, n_samples)
    lor = np.random.uniform(1, 5, n_samples)
    cgpa = np.random.uniform(6, 10, n_samples)
    research = np.random.randint(0, 2, n_samples)
    
    # Create target with realistic pattern
    gre_norm = (gre_scores - 260) / 80 * 100
    toefl_norm = toefl_scores / 120 * 100
    uni_norm = uni_ratings / 5 * 100
    sop_norm = sop / 5 * 100
    lor_norm = lor / 5 * 100
    cgpa_norm = cgpa / 10 * 100
    
    admission_chance = (
        0.20 * gre_norm +
        0.10 * toefl_norm +
        0.10 * uni_norm +
        0.10 * sop_norm +
        0.10 * lor_norm +
        0.30 * cgpa_norm +
        5 * research +
        np.random.normal(0, 3, n_samples)
    )
    admission_chance = np.clip(admission_chance, 0, 100)
    
    X = np.column_stack([gre_scores, toefl_scores, uni_ratings, sop, lor, cgpa, research])
    y = admission_chance
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train model
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    
    print("Training Random Forest with 100 estimators...")
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    print(f"PG Model Performance:")
    print(f"  R² Score: {r2:.3f}")
    print(f"  RMSE: {rmse:.3f}")
    
    # Save model
    with open('pg_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    print("PG model saved as 'pg_model.pkl'")
    
    return model

if __name__ == "__main__":
    print("="*50)
    print("ADMISSION PREDICTION MODEL TRAINING")
    print("="*50)
    
    # Train both models
    ug_model = train_ug_model()
    pg_model = train_pg_model()
    
    print("\n" + "="*50)
    print("✅ Training Complete!")
    print("👩‍💻 Developed by Sneha Chaudhari")
    print("="*50)