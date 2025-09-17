#!/usr/bin/env python3
import sys
import json

def predict_stream(answers):
    """Predict stream based on user answers using rule-based logic"""
    try:
        # Initialize scores for each course
        scores = {
            "Software Engineering": 0,
            "Medical": 0,
            "Business Management": 0,
            "Political Science": 0
        }
        
        # Question 1: What are your interests?
        interests = answers.get("1", "")
        if interests == "science_research":
            scores["Medical"] += 3
        elif interests == "coding":
            scores["Software Engineering"] += 3
        elif interests == "business_ideas":
            scores["Business Management"] += 3
        elif interests == "creative_work":
            scores["Political Science"] += 2
        elif interests == "social_work":
            scores["Political Science"] += 3
        
        # Question 2: What is your future vision?
        future_vision = answers.get("2", "")
        if future_vision == "research_higher_studies":
            scores["Medical"] += 2
        elif future_vision == "corporate_job":
            scores["Business Management"] += 2
            scores["Software Engineering"] += 1
        elif future_vision == "government_job":
            scores["Political Science"] += 2
        elif future_vision == "startup":
            scores["Business Management"] += 3
        
        # Question 3: Do you follow current affairs?
        current_affairs = answers.get("3", "")
        if current_affairs == "yes":
            scores["Political Science"] += 2
            scores["Business Management"] += 1
        
        # Question 4: What is your career priority?
        career_priority = answers.get("4", "")
        if career_priority == "high_salary":
            scores["Software Engineering"] += 2
            scores["Business Management"] += 1
        elif career_priority == "job_security":
            scores["Medical"] += 2
            scores["Software Engineering"] += 1
        elif career_priority == "social_impact":
            scores["Political Science"] += 2
            scores["Medical"] += 1
        elif career_priority == "creativity_freedom":
            scores["Software Engineering"] += 1
        
        # Question 5: What duration are you aiming for?
        duration = answers.get("5", "")
        if duration == "3_years":
            scores["Business Management"] += 1
            scores["Political Science"] += 1
        elif duration == "4_years":
            scores["Software Engineering"] += 2
            scores["Business Management"] += 1
        elif duration == "5_plus_years":
            scores["Medical"] += 2
        
        # Question 6: What is your favorite subject?
        favorite_subject = answers.get("6", "")
        subject_mapping = {
            "physics": "Medical",
            "chemistry": "Medical", 
            "biology": "Medical",
            "mathematics": "Software Engineering",
            "computer_science": "Software Engineering",
            "commerce": "Business Management",
            "business_studies": "Business Management",
            "economics": "Business Management",
            "arts": "Political Science",
            "literature": "Political Science",
            "history": "Political Science",
            "political_science": "Political Science",
            "sociology": "Political Science",
            "english": "Political Science"
        }
        
        if favorite_subject in subject_mapping:
            scores[subject_mapping[favorite_subject]] += 3
        
        # Find the course with highest score
        recommended_course = max(scores, key=scores.get)
        max_score = scores[recommended_course]
        total_possible = 15  # Maximum possible score
        
        # Calculate confidence
        confidence_percentage = (max_score / total_possible) * 100
        if confidence_percentage >= 70:
            confidence_level = "High"
        elif confidence_percentage >= 50:
            confidence_level = "Medium"
        else:
            confidence_level = "Low"
        
        return {
            "recommended_course": recommended_course,
            "confidence": confidence_level,
            "success": True,
            "scores": scores
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "success": False
        }

if __name__ == "__main__":
    try:
        # Read answers from command line argument
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No input provided", "success": False}))
            sys.exit(1)
        
        answers_json = sys.argv[1]
        answers = json.loads(answers_json)
        
        # Get prediction
        result = predict_stream(answers)
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": f"Script error: {str(e)}", "success": False}))
        sys.exit(1)