"""
Synthetic Data Generator for HealthOS AI Agents
Generates realistic healthcare data for development and testing
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
from typing import Dict, List, Tuple
import json
from pathlib import Path

class SyntheticDataGenerator:
    """Generates synthetic healthcare data for AI training"""
    
    def __init__(self):
        self.departments = [
            "Cardiology", "Orthopedics", "Neurology", "Oncology", 
            "Emergency", "General Medicine", "Pediatrics", "Gynecology"
        ]
        
        self.symptoms = {
            "Cardiology": ["chest pain", "shortness of breath", "palpitations", "dizziness"],
            "Orthopedics": ["joint pain", "back pain", "fracture", "swelling"],
            "Neurology": ["headache", "numbness", "seizures", "memory loss"],
            "Emergency": ["trauma", "bleeding", "unconsciousness", "severe pain"],
            "General Medicine": ["fever", "cough", "fatigue", "nausea"],
            "Pediatrics": ["fever", "cough", "rash", "feeding issues"],
            "Gynecology": ["abdominal pain", "irregular bleeding", "pregnancy concerns"]
        }
        
        self.urgency_levels = {
            1: "Non-urgent",
            2: "Low urgency", 
            3: "Medium urgency",
            4: "High urgency",
            5: "Emergency"
        }
        
        self.staff_roles = ["Doctor", "Nurse", "Technician", "Receptionist"]
    
    def generate_patient_demographics(self, num_patients: int = 1000) -> pd.DataFrame:
        """Generate synthetic patient demographics"""
        
        # Age distribution (realistic healthcare age distribution)
        ages = np.random.normal(45, 20, num_patients)
        ages = np.clip(ages, 0, 100).astype(int)
        
        # Gender distribution
        genders = np.random.choice(["Male", "Female"], num_patients, p=[0.48, 0.52])
        
        # Generate patient IDs
        patient_ids = [f"P{i:06d}" for i in range(1, num_patients + 1)]
        
        # Medical history complexity (0-10 scale)
        medical_complexity = np.random.exponential(2, num_patients)
        medical_complexity = np.clip(medical_complexity, 0, 10)
        
        # Risk factors
        risk_factors = []
        for _ in range(num_patients):
            factors = []
            if random.random() < 0.3:
                factors.append("Hypertension")
            if random.random() < 0.25:
                factors.append("Diabetes")
            if random.random() < 0.2:
                factors.append("Heart Disease")
            if random.random() < 0.15:
                factors.append("Obesity")
            risk_factors.append(", ".join(factors) if factors else "None")
        
        data = {
            "patient_id": patient_ids,
            "age": ages,
            "gender": genders,
            "medical_complexity": medical_complexity,
            "risk_factors": risk_factors,
            "created_at": [datetime.now() - timedelta(days=random.randint(1, 365)) for _ in range(num_patients)]
        }
        
        return pd.DataFrame(data)
    
    def generate_queue_data(self, days: int = 30, patients_per_day: int = 50) -> pd.DataFrame:
        """Generate synthetic queue management data"""
        
        queue_data = []
        base_time = datetime.now() - timedelta(days=days)
        
        for day in range(days):
            current_date = base_time + timedelta(days=day)
            
            # Generate patients for this day
            daily_patients = np.random.poisson(patients_per_day)
            
            for patient_num in range(daily_patients):
                # Arrival time (8 AM to 6 PM)
                arrival_hour = np.random.normal(11, 2)  # Peak around 11 AM
                arrival_hour = np.clip(arrival_hour, 8, 18)
                arrival_time = current_date.replace(
                    hour=int(arrival_hour),
                    minute=random.randint(0, 59)
                )
                
                # Department assignment
                department = random.choice(self.departments)
                
                # Queue length at arrival (depends on time and department)
                base_queue_length = max(0, int(np.random.normal(8, 3)))
                if arrival_hour < 10 or arrival_hour > 16:  # Off-peak
                    base_queue_length = max(0, int(base_queue_length * 0.6))
                
                # Wait time (depends on queue length, department, urgency)
                urgency = random.choices([1, 2, 3, 4, 5], weights=[0.3, 0.3, 0.2, 0.15, 0.05])[0]
                base_wait_time = base_queue_length * 15  # 15 minutes per person in queue
                
                # Urgency affects wait time
                if urgency >= 4:
                    wait_time = base_wait_time * 0.3  # Emergency patients wait less
                elif urgency == 1:
                    wait_time = base_wait_time * 1.5  # Non-urgent wait more
                else:
                    wait_time = base_wait_time
                
                wait_time = max(5, min(wait_time, 180))  # 5 min to 3 hours
                
                # Staff available (varies by time and day)
                staff_available = max(1, int(np.random.normal(5, 1)))
                if arrival_hour < 9 or arrival_hour > 17:
                    staff_available = max(1, int(staff_available * 0.5))
                
                # Room availability
                rooms_available = max(0, int(np.random.normal(8, 2)))
                
                queue_data.append({
                    "timestamp": arrival_time,
                    "patient_id": f"P{random.randint(1, 1000):06d}",
                    "department": department,
                    "queue_length": base_queue_length,
                    "wait_time_minutes": int(wait_time),
                    "urgency_level": urgency,
                    "staff_available": staff_available,
                    "rooms_available": rooms_available,
                    "day_of_week": arrival_time.weekday(),
                    "hour_of_day": arrival_time.hour,
                    "is_weekend": arrival_time.weekday() >= 5
                })
        
        return pd.DataFrame(queue_data)
    
    def generate_appointment_data(self, days: int = 30) -> pd.DataFrame:
        """Generate synthetic appointment scheduling data"""
        
        appointment_data = []
        base_time = datetime.now() - timedelta(days=days)
        
        for day in range(days):
            current_date = base_time + timedelta(days=day)
            
            # Number of appointments per day
            daily_appointments = np.random.poisson(40)
            
            for appt_num in range(daily_appointments):
                # Appointment time
                appt_hour = np.random.normal(11, 2)
                appt_hour = np.clip(appt_hour, 9, 17)
                appointment_time = current_date.replace(
                    hour=int(appt_hour),
                    minute=random.choice([0, 15, 30, 45])
                )
                
                # Department
                department = random.choice(self.departments)
                
                # Appointment type
                appt_types = ["Follow-up", "New Patient", "Consultation", "Procedure", "Emergency"]
                appt_type = random.choice(appt_types)
                
                # Duration (depends on type and department)
                if appt_type == "Emergency":
                    duration = random.randint(15, 45)
                elif appt_type == "Procedure":
                    duration = random.randint(30, 120)
                else:
                    duration = random.randint(20, 60)
                
                # No-show probability (depends on various factors)
                no_show_prob = 0.1  # Base 10%
                if appt_type == "Follow-up":
                    no_show_prob += 0.05
                if appointment_time.hour < 10:
                    no_show_prob += 0.03
                
                no_show = random.random() < no_show_prob
                
                # Rescheduled
                rescheduled = random.random() < 0.15
                
                appointment_data.append({
                    "appointment_id": f"APT{day:03d}{appt_num:03d}",
                    "patient_id": f"P{random.randint(1, 1000):06d}",
                    "department": department,
                    "appointment_time": appointment_time,
                    "appointment_type": appt_type,
                    "duration_minutes": duration,
                    "no_show": no_show,
                    "rescheduled": rescheduled,
                    "created_at": appointment_time - timedelta(days=random.randint(1, 30))
                })
        
        return pd.DataFrame(appointment_data)
    
    def generate_clinical_notes(self, num_notes: int = 500) -> pd.DataFrame:
        """Generate synthetic clinical notes for NLP training"""
        
        notes_data = []
        
        for i in range(num_notes):
            # Patient info
            age = random.randint(18, 85)
            gender = random.choice(["Male", "Female"])
            
            # Department
            department = random.choice(self.departments)
            
            # Generate realistic clinical note
            note_template = self._generate_note_template(department, age, gender)
            
            # Add some variation
            note = self._add_variation_to_note(note_template)
            
            notes_data.append({
                "note_id": f"NOTE{i:06d}",
                "patient_id": f"P{random.randint(1, 1000):06d}",
                "department": department,
                "age": age,
                "gender": gender,
                "clinical_note": note,
                "created_at": datetime.now() - timedelta(days=random.randint(1, 365))
            })
        
        return pd.DataFrame(notes_data)
    
    def _generate_note_template(self, department: str, age: int, gender: str) -> str:
        """Generate a clinical note template based on department"""
        
        templates = {
            "Cardiology": f"Patient is a {age}-year-old {gender.lower()} presenting with chest pain. Vital signs: BP {random.randint(120, 180)}/{random.randint(70, 100)}, HR {random.randint(60, 100)}. ECG shows normal sinus rhythm. Plan: Continue monitoring, consider stress test.",
            "Orthopedics": f"Patient is a {age}-year-old {gender.lower()} with {random.choice(['right', 'left'])} knee pain. Pain is {random.choice(['sharp', 'dull', 'aching'])} and {random.choice(['worse with movement', 'constant', 'intermittent'])}. X-ray ordered. Plan: Physical therapy, pain management.",
            "Neurology": f"Patient is a {age}-year-old {gender.lower()} with {random.choice(['headache', 'numbness', 'seizures'])}. Symptoms began {random.randint(1, 30)} days ago. Neurological exam {random.choice(['normal', 'abnormal'])}. Plan: MRI brain, follow-up in 2 weeks.",
            "Emergency": f"Patient is a {age}-year-old {gender.lower()} brought in by ambulance. Chief complaint: {random.choice(['trauma', 'chest pain', 'shortness of breath', 'altered mental status'])}. Vital signs stable. Plan: {random.choice(['admit', 'discharge', 'observe'])}.",
            "General Medicine": f"Patient is a {age}-year-old {gender.lower()} with {random.choice(['fever', 'cough', 'fatigue'])} for {random.randint(1, 7)} days. Physical exam: {random.choice(['normal', 'mildly abnormal'])}. Plan: {random.choice(['antibiotics', 'supportive care', 'follow-up'])}."
        }
        
        return templates.get(department, f"Patient is a {age}-year-old {gender.lower()} with various symptoms.")
    
    def _add_variation_to_note(self, template: str) -> str:
        """Add realistic variation to clinical notes"""
        
        # Add some random medical terms
        medical_terms = [
            "hypertension", "diabetes", "hyperlipidemia", "asthma", "COPD",
            "congestive heart failure", "atrial fibrillation", "stroke", "cancer"
        ]
        
        if random.random() < 0.3:
            template += f" Past medical history includes {random.choice(medical_terms)}."
        
        # Add medications
        medications = [
            "aspirin", "metformin", "lisinopril", "atorvastatin", "metoprolol",
            "amlodipine", "losartan", "hydrochlorothiazide"
        ]
        
        if random.random() < 0.4:
            template += f" Current medications: {random.choice(medications)} {random.randint(5, 40)}mg daily."
        
        return template
    
    def save_datasets(self, output_path: Path):
        """Save all generated datasets"""
        
        # Generate all datasets
        print("Generating patient demographics...")
        patient_demographics = self.generate_patient_demographics(1000)
        patient_demographics.to_csv(output_path / "patient_demographics.csv", index=False)
        
        print("Generating queue data...")
        queue_data = self.generate_queue_data(30, 50)
        queue_data.to_csv(output_path / "queue_data.csv", index=False)
        
        print("Generating appointment data...")
        appointment_data = self.generate_appointment_data(30)
        appointment_data.to_csv(output_path / "appointment_data.csv", index=False)
        
        print("Generating clinical notes...")
        clinical_notes = self.generate_clinical_notes(500)
        clinical_notes.to_csv(output_path / "clinical_notes.csv", index=False)
        
        # Save metadata
        metadata = {
            "generated_at": datetime.now().isoformat(),
            "datasets": {
                "patient_demographics": {"rows": len(patient_demographics), "columns": list(patient_demographics.columns)},
                "queue_data": {"rows": len(queue_data), "columns": list(queue_data.columns)},
                "appointment_data": {"rows": len(appointment_data), "columns": list(appointment_data.columns)},
                "clinical_notes": {"rows": len(clinical_notes), "columns": list(clinical_notes.columns)}
            }
        }
        
        with open(output_path / "metadata.json", "w") as f:
            json.dump(metadata, f, indent=2)
        
        print(f"All datasets saved to {output_path}")
        return metadata

if __name__ == "__main__":
    # Generate synthetic data
    generator = SyntheticDataGenerator()
    output_path = Path("ml/datasets/raw/synthetic_data")
    output_path.mkdir(parents=True, exist_ok=True)
    
    metadata = generator.save_datasets(output_path)
    print("Synthetic data generation completed!")
    print(f"Generated {metadata['datasets']['patient_demographics']['rows']} patient records")
    print(f"Generated {metadata['datasets']['queue_data']['rows']} queue entries")
    print(f"Generated {metadata['datasets']['appointment_data']['rows']} appointments")
    print(f"Generated {metadata['datasets']['clinical_notes']['rows']} clinical notes") 