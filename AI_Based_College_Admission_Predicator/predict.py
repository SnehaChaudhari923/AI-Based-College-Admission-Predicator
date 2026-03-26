import numpy as np
import pickle
import os

class AdmissionPredictor:
    def __init__(self):
        self.ug_model = None
        self.pg_model = None
        self.load_models()
    
    def load_models(self):
        """Load trained models"""
        try:
            if os.path.exists('ug_model.pkl'):
                with open('ug_model.pkl', 'rb') as f:
                    self.ug_model = pickle.load(f)
                print("✅ UG model loaded successfully")
            else:
                print("⚠️ UG model not found. Using fallback calculations")
            
            if os.path.exists('pg_model.pkl'):
                with open('pg_model.pkl', 'rb') as f:
                    self.pg_model = pickle.load(f)
                print("✅ PG model loaded successfully")
            else:
                print("⚠️ PG model not found. Using fallback calculations")
        except Exception as e:
            print(f"❌ Error loading models: {e}")
    
    def predict_ug(self, board_percentage, entrance_score, extracurricular, category, stream):
        """
        Predict UG admission chance
        """
        try:
            # Category weight factors
            category_weights = {
                'General': 1.0,
                'OBC': 1.05,
                'SC': 1.10,
                'ST': 1.10,
                'EWS': 1.05
            }
            
            # Stream demand factors (simplified)
            stream_demand = {
                'Computer Science': 0.95,  # High demand, more competition
                'Electronics': 0.97,
                'Mechanical': 1.0,
                'Civil': 1.02,
                'Electrical': 1.0,
                'Chemical': 1.03,
                'Biotechnology': 1.04
            }
            
            category_weight = category_weights.get(category, 1.0)
            stream_factor = stream_demand.get(stream, 1.0)
            
            if self.ug_model is not None:
                # Use ML model if available
                features = np.array([[board_percentage, entrance_score, extracurricular]])
                base_prediction = self.ug_model.predict(features)[0]
            else:
                # Fallback calculation
                board_norm = board_percentage / 100 * 40  # 40% weight
                entrance_norm = (entrance_score / 360) * 100 * 40  # 40% weight
                extra_norm = extracurricular * 2  # 20% weight (0-10 scale to 0-20)
                base_prediction = board_norm + entrance_norm + extra_norm
            
            # Apply category and stream adjustments
            prediction = base_prediction * category_weight * stream_factor
            
            # Ensure prediction is within 0-100 range
            prediction = max(0, min(100, prediction))
            
            return round(prediction, 2)
        except Exception as e:
            print(f"UG Prediction error: {str(e)}")
            return 50.0
    
    def predict_pg(self, gre_score, toefl_score, university_rating, sop, lor, cgpa, research):
        """
        Predict PG admission chance
        """
        try:
            if self.pg_model is not None:
                # Use ML model if available
                features = np.array([[
                    gre_score, toefl_score, university_rating, 
                    sop, lor, cgpa, 1 if research else 0
                ]])
                prediction = self.pg_model.predict(features)[0]
            else:
                # Fallback calculation with weights
                gre_norm = (gre_score - 260) / 80 * 100 * 0.25  # 25% weight
                toefl_norm = (toefl_score / 120) * 100 * 0.15  # 15% weight
                uni_norm = (university_rating / 5) * 100 * 0.10  # 10% weight
                sop_norm = (sop / 5) * 100 * 0.10  # 10% weight
                lor_norm = (lor / 5) * 100 * 0.10  # 10% weight
                cgpa_norm = (cgpa / 10) * 100 * 0.20  # 20% weight
                research_bonus = 5 if research else 0  # 5% bonus
                
                prediction = (gre_norm + toefl_norm + uni_norm + 
                            sop_norm + lor_norm + cgpa_norm + research_bonus)
            
            # Ensure prediction is within 0-100 range
            prediction = max(0, min(100, prediction))
            
            return round(prediction, 2)
        except Exception as e:
            print(f"PG Prediction error: {str(e)}")
            return 50.0
    
    def get_interpretation(self, prediction):
        """Generate interpretation based on prediction"""
        if prediction >= 80:
            return "🌟 Excellent chance! Your profile is very competitive. Strongly recommend applying to top institutions."
        elif prediction >= 70:
            return "📈 Very good chance! You have strong potential. Consider applying to a mix of top and mid-tier institutions."
        elif prediction >= 60:
            return "📊 Good chance! Your profile is solid. Focus on institutions that match your profile."
        elif prediction >= 50:
            return "📉 Moderate chance. Consider applying to multiple institutions and work on strengthening your profile."
        elif prediction >= 40:
            return "⚠️ Below average chance. You may need to improve your scores or consider less competitive programs."
        else:
            return "🔴 Low chance. Significant improvement needed in your academic profile before applying."

# Create global predictor instance
predictor = AdmissionPredictor()