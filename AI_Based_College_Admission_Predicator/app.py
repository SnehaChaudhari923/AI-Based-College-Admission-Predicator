from flask import Flask, render_template, request, jsonify
import numpy as np
import traceback

app = Flask(__name__)

class AdmissionPredictor:
    def predict_ug(self, entrance_score, board_percentage, extracurricular, category, stream, exam_type):
        """Predict UG admission with exam type consideration"""
        try:
            # Base calculation
            entrance_weight = 0.4
            board_weight = 0.3
            extra_weight = 0.2
            category_weight = 0.05
            stream_weight = 0.05
            
            # Normalize scores based on exam type
            max_scores = {
                'jee': 360, 'jee_advanced': 360, 'neet': 720, 'bitsat': 450,
                'mhtcet': 200, 'kcet': 180, 'wbjee': 200, 'comedk': 180,
                'viteee': 130, 'met': 200
            }
            
            max_score = max_scores.get(exam_type, 360)
            entrance_normalized = (entrance_score / max_score) * 100
            
            # Category factor
            category_factors = {
                'General': 1.0, 'OBC': 1.05, 'SC': 1.08, 'ST': 1.08, 'EWS': 1.05
            }
            
            # Stream demand factor
            stream_factors = {
                'Computer Science': 0.95, 'Information Technology': 0.96,
                'Electronics': 0.98, 'Electrical': 1.0, 'Mechanical': 1.02,
                'Civil': 1.03, 'Chemical': 1.04, 'Biotechnology': 1.05,
                'Aerospace': 0.97
            }
            
            prediction = (
                entrance_normalized * entrance_weight +
                board_percentage * board_weight +
                (extracurricular * 10) * extra_weight +
                50 * category_weight +  # Base for category
                50 * stream_weight       # Base for stream
            ) * category_factors.get(category, 1.0) * stream_factors.get(stream, 1.0)
            
            return max(0, min(100, prediction))
            
        except Exception as e:
            print(f"UG Prediction error: {e}")
            return 50.0
    
    def predict_pg(self, gre_score, toefl_score, university_rating, sop, lor, cgpa, research):
        """Predict PG admission"""
        try:
            gre_norm = ((gre_score - 260) / 80) * 100 * 0.25
            toefl_norm = (toefl_score / 120) * 100 * 0.15
            uni_norm = (university_rating / 5) * 100 * 0.10
            sop_norm = (sop / 5) * 100 * 0.10
            lor_norm = (lor / 5) * 100 * 0.10
            cgpa_norm = (cgpa / 10) * 100 * 0.20
            research_bonus = 5 if research else 0
            
            prediction = gre_norm + toefl_norm + uni_norm + sop_norm + lor_norm + cgpa_norm + research_bonus
            return max(0, min(100, prediction))
            
        except Exception as e:
            print(f"PG Prediction error: {e}")
            return 50.0

predictor = AdmissionPredictor()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict/ug', methods=['POST'])
def predict_ug():
    try:
        data = request.get_json()
        
        prediction = predictor.predict_ug(
            float(data.get('entrance_score', 0)),
            float(data.get('board_percentage', 0)),
            float(data.get('extracurricular', 0)),
            data.get('category', 'General'),
            data.get('stream', 'Computer Science'),
            data.get('exam_type', 'jee')
        )
        
        admission_prob = min(100, max(0, prediction))
        
        return jsonify({
            'prediction': 'ADMITTED' if admission_prob >= 50 else 'NOT ADMITTED',
            'admission_probability': round(admission_prob, 1),
            'rejection_probability': round(100 - admission_prob, 1),
            'confidence': round(min(95, admission_prob + 10), 1),
            'features': {
                'Exam Type': data.get('exam_type', 'JEE').upper(),
                'Entrance Score': data.get('entrance_score'),
                'Board Percentage': f"{data.get('board_percentage')}%",
                'Extracurricular': data.get('extracurricular'),
                'Category': data.get('category'),
                'Stream': data.get('stream')
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict/pg', methods=['POST'])
def predict_pg():
    try:
        data = request.get_json()
        
        prediction = predictor.predict_pg(
            float(data.get('gre_score', 0)),
            float(data.get('toefl_score', 0)),
            float(data.get('university_rating', 0)),
            float(data.get('sop', 0)),
            float(data.get('lor', 0)),
            float(data.get('cgpa', 0)),
            data.get('research', False)
        )
        
        admission_prob = min(100, max(0, prediction))
        
        return jsonify({
            'prediction': 'ADMITTED' if admission_prob >= 50 else 'NOT ADMITTED',
            'admission_probability': round(admission_prob, 1),
            'rejection_probability': round(100 - admission_prob, 1),
            'confidence': round(min(95, admission_prob + 8), 1),
            'features': {
                'GRE Score': data.get('gre_score'),
                'TOEFL Score': data.get('toefl_score'),
                'University Rating': data.get('university_rating'),
                'CGPA': data.get('cgpa'),
                'SOP': data.get('sop'),
                'LOR': data.get('lor'),
                'Research': 'Yes' if data.get('research') else 'No'
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🎓 AI COLLEGE ADMISSION PREDICTOR")
    print("="*60)
    print("👩‍💻 Developed by Sneha Chaudhari")
    print("🌐 http://localhost:5000")
    print("="*60)
    app.run(debug=True, host='0.0.0.0', port=5000)