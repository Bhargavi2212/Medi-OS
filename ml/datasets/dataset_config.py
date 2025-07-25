"""
Dataset Configuration for HealthOS AI Agents
Manages all dataset sources, paths, and preprocessing settings
"""

import os
from pathlib import Path
from typing import Dict, List, Optional

class DatasetConfig:
    """Configuration for all healthcare datasets"""
    
    def __init__(self):
        # Base paths
        self.base_path = Path("ml/datasets")
        self.raw_data_path = self.base_path / "raw"
        self.processed_data_path = self.base_path / "processed"
        self.cache_path = self.base_path / "cache"
        
        # Create directories
        self._create_directories()
        
        # Dataset configurations
        self.datasets = {
            "mimic_iv": {
                "name": "MIMIC-IV Clinical Notes",
                "source": "https://physionet.org/content/mimiciv/",
                "raw_path": self.raw_data_path / "mimic_iv",
                "processed_path": self.processed_data_path / "mimic_iv",
                "requires_auth": True,
                "size_gb": 50,
                "description": "Clinical notes and patient data from ICU"
            },
            "chexpert": {
                "name": "CheXpert Chest X-rays",
                "source": "https://stanfordmlgroup.github.io/projects/chexpert/",
                "raw_path": self.raw_data_path / "chexpert",
                "processed_path": self.processed_data_path / "chexpert",
                "requires_auth": False,
                "size_gb": 15,
                "description": "Chest X-ray images with 14 pathologies"
            },
            "mednli": {
                "name": "MedNLI Medical Text",
                "source": "https://github.com/jgc128/mednli_baseline",
                "raw_path": self.raw_data_path / "mednli",
                "processed_path": self.processed_data_path / "mednli",
                "requires_auth": False,
                "size_gb": 0.1,
                "description": "Medical natural language inference pairs"
            },
            "synthetic_queue": {
                "name": "Synthetic Queue Data",
                "source": "generated",
                "raw_path": self.raw_data_path / "synthetic_queue",
                "processed_path": self.processed_data_path / "synthetic_queue",
                "requires_auth": False,
                "size_gb": 0.5,
                "description": "Generated patient flow and queue data"
            },
            "synthetic_patients": {
                "name": "Synthetic Patient Data",
                "source": "generated",
                "raw_path": self.raw_data_path / "synthetic_patients",
                "processed_path": self.processed_data_path / "synthetic_patients",
                "requires_auth": False,
                "size_gb": 0.2,
                "description": "Generated patient demographics and history"
            }
        }
        
        # Preprocessing settings
        self.preprocessing_config = {
            "text": {
                "max_length": 512,
                "lowercase": True,
                "remove_special_chars": True,
                "medical_entity_extraction": True,
                "deidentification": True
            },
            "image": {
                "target_size": (224, 224),
                "normalize": True,
                "augmentation": True,
                "quality_threshold": 0.8
            },
            "queue": {
                "time_window": "1h",
                "features": ["queue_length", "wait_time", "staff_available"],
                "target": "predicted_wait_time"
            }
        }
    
    def _create_directories(self):
        """Create necessary directories"""
        directories = [
            self.raw_data_path,
            self.processed_data_path,
            self.cache_path
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
    
    def get_dataset_path(self, dataset_name: str, data_type: str = "raw") -> Path:
        """Get path for specific dataset and data type"""
        if dataset_name not in self.datasets:
            raise ValueError(f"Unknown dataset: {dataset_name}")
        
        dataset = self.datasets[dataset_name]
        if data_type == "raw":
            return dataset["raw_path"]
        elif data_type == "processed":
            return dataset["processed_path"]
        else:
            raise ValueError(f"Unknown data type: {data_type}")
    
    def get_dataset_info(self, dataset_name: str) -> Dict:
        """Get information about a specific dataset"""
        if dataset_name not in self.datasets:
            raise ValueError(f"Unknown dataset: {dataset_name}")
        
        return self.datasets[dataset_name]
    
    def list_datasets(self) -> List[str]:
        """List all available datasets"""
        return list(self.datasets.keys())
    
    def get_preprocessing_config(self, data_type: str) -> Dict:
        """Get preprocessing configuration for data type"""
        if data_type not in self.preprocessing_config:
            raise ValueError(f"Unknown data type: {data_type}")
        
        return self.preprocessing_config[data_type]

# Global configuration instance
dataset_config = DatasetConfig() 