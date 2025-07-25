#!/usr/bin/env python3
"""
MarketAgent - Market Analysis & Strategy Agent
Provides market trend analysis, competitive intelligence, demand forecasting,
pricing strategy optimization, market opportunity identification, and strategic recommendations.
"""

import os
import json
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Tuple, Optional
import joblib
import logging
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

# ML imports
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, accuracy_score, classification_report
import matplotlib.pyplot as plt
import seaborn as sns

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MarketAgent:
    """
    MarketAgent - Market Analysis & Strategy Agent
    
    Core Functions:
    1. Market Trend Analysis: Analyze market trends and patterns
    2. Competitive Intelligence: Gather and analyze competitor information
    3. Demand Forecasting: Predict future market demand
    4. Pricing Strategy Optimization: Optimize pricing strategies
    5. Market Opportunity Identification: Identify new market opportunities
    6. Strategic Recommendations: Provide strategic business recommendations
    """
    
    def __init__(self):
        self.project_root = os.getcwd()
        self.models_dir = os.path.join(self.project_root, "backend/src/ml/agents/market_agent/models")
        self.data_dir = os.path.join(self.project_root, "backend/src/ml/data/market_agent")
        
        # Create directories
        os.makedirs(self.models_dir, exist_ok=True)
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Initialize models
        self.models = {}
        self.scalers = {}
        self.label_encoders = {}
        
        # Load or initialize models
        self._initialize_models()
        
        # Market configuration
        self.market_config = {
            'forecast_horizon': 12,  # months
            'confidence_threshold': 0.8,
            'market_segments': ['Primary Care', 'Specialty Care', 'Emergency Care', 'Telemedicine'],
            'geographic_regions': ['North', 'South', 'East', 'West', 'Central']
        }
        
        # Healthcare market segments
        self.market_segments = {
            'primary_care': {
                'market_size': 15000000000,  # $15B
                'growth_rate': 0.05,
                'key_players': ['Kaiser Permanente', 'UnitedHealth', 'CVS Health'],
                'trends': ['Digital Health', 'Preventive Care', 'Value-Based Care']
            },
            'specialty_care': {
                'market_size': 25000000000,  # $25B
                'growth_rate': 0.07,
                'key_players': ['Mayo Clinic', 'Cleveland Clinic', 'Johns Hopkins'],
                'trends': ['Precision Medicine', 'Specialized Treatment', 'Research Integration']
            },
            'emergency_care': {
                'market_size': 8000000000,   # $8B
                'growth_rate': 0.04,
                'key_players': ['HCA Healthcare', 'Tenet Healthcare', 'Community Health Systems'],
                'trends': ['Urgent Care Centers', 'Telemedicine', 'Mobile Health']
            },
            'telemedicine': {
                'market_size': 12000000000,  # $12B
                'growth_rate': 0.15,
                'key_players': ['Teladoc', 'Amwell', 'MDLive'],
                'trends': ['AI Integration', 'Remote Monitoring', 'Virtual Care']
            }
        }
    
    def _initialize_models(self):
        """Initialize ML models for market analysis"""
        model_configs = {
            'trend_analyzer': {
                'type': 'regression',
                'model': RandomForestRegressor(n_estimators=100, random_state=42),
                'description': 'Market trend analysis and prediction'
            },
            'competitor_analyzer': {
                'type': 'classification',
                'model': RandomForestClassifier(n_estimators=100, random_state=42),
                'description': 'Competitive intelligence analysis'
            },
            'demand_forecaster': {
                'type': 'regression',
                'model': LinearRegression(),
                'description': 'Demand forecasting and prediction'
            },
            'pricing_optimizer': {
                'type': 'regression',
                'model': RandomForestRegressor(n_estimators=100, random_state=42),
                'description': 'Pricing strategy optimization'
            }
        }
        
        for model_name, config in model_configs.items():
            self.models[model_name] = config['model']
            self.scalers[model_name] = StandardScaler()
            self.label_encoders[model_name] = LabelEncoder()
            
        logger.info(f"Initialized {len(self.models)} models for MarketAgent")
    
    def generate_synthetic_market_data(self, n_samples: int = 10000) -> Dict[str, pd.DataFrame]:
        """Generate synthetic market data for analysis"""
        np.random.seed(42)
        
        # Market trend data
        trend_data = {
            'date': pd.date_range('2020-01-01', periods=n_samples//10, freq='M'),
            'market_segment': np.random.choice(['Primary Care', 'Specialty Care', 'Emergency Care', 'Telemedicine'], n_samples//10),
            'region': np.random.choice(['North', 'South', 'East', 'West', 'Central'], n_samples//10),
            'market_size_millions': np.random.normal(500, 200, n_samples//10),
            'growth_rate': np.random.uniform(0.02, 0.15, n_samples//10),
            'adoption_rate': np.random.uniform(0.1, 0.8, n_samples//10),
            'competition_level': np.random.choice(['Low', 'Medium', 'High'], n_samples//10),
            'regulatory_environment': np.random.choice(['Favorable', 'Neutral', 'Challenging'], n_samples//10)
        }
        
        # Competitor analysis data
        competitor_data = {
            'competitor_id': range(1, n_samples//5 + 1),
            'competitor_name': np.random.choice(['Kaiser', 'UnitedHealth', 'CVS', 'Mayo', 'Cleveland', 'Teladoc'], n_samples//5),
            'market_share': np.random.uniform(0.01, 0.25, n_samples//5),
            'revenue_millions': np.random.normal(1000, 500, n_samples//5),
            'growth_rate': np.random.uniform(-0.05, 0.20, n_samples//5),
            'pricing_strategy': np.random.choice(['Premium', 'Competitive', 'Low-Cost'], n_samples//5),
            'technology_investment': np.random.uniform(0.05, 0.25, n_samples//5),
            'customer_satisfaction': np.random.uniform(3.0, 4.8, n_samples//5),
            'is_threat': np.random.choice([True, False], n_samples//5, p=[0.3, 0.7])
        }
        
        # Demand forecasting data
        demand_data = {
            'forecast_date': pd.date_range('2024-01-01', periods=n_samples//20, freq='M'),
            'market_segment': np.random.choice(['Primary Care', 'Specialty Care', 'Emergency Care', 'Telemedicine'], n_samples//20),
            'demand_volume': np.random.normal(10000, 3000, n_samples//20),
            'price_sensitivity': np.random.uniform(0.5, 2.0, n_samples//20),
            'seasonal_factor': np.random.uniform(0.8, 1.2, n_samples//20),
            'economic_indicator': np.random.uniform(0.9, 1.1, n_samples//20),
            'technology_adoption': np.random.uniform(0.3, 0.9, n_samples//20),
            'predicted_demand': np.random.normal(12000, 4000, n_samples//20)
        }
        
        # Pricing data
        pricing_data = {
            'product_id': range(1, n_samples//4 + 1),
            'market_segment': np.random.choice(['Primary Care', 'Specialty Care', 'Emergency Care', 'Telemedicine'], n_samples//4),
            'current_price': np.random.normal(150, 50, n_samples//4),
            'competitor_price': np.random.normal(140, 60, n_samples//4),
            'cost_of_production': np.random.normal(80, 30, n_samples//4),
            'demand_elasticity': np.random.uniform(-2.0, -0.5, n_samples//4),
            'market_share': np.random.uniform(0.01, 0.15, n_samples//4),
            'profit_margin': np.random.uniform(0.1, 0.4, n_samples//4),
            'optimal_price': np.random.normal(160, 40, n_samples//4)
        }
        
        return {
            'trend_data': pd.DataFrame(trend_data),
            'competitor_data': pd.DataFrame(competitor_data),
            'demand_data': pd.DataFrame(demand_data),
            'pricing_data': pd.DataFrame(pricing_data)
        }
    
    def analyze_market_trends(self, trend_data: pd.DataFrame) -> Dict[str, Any]:
        """Analyze market trends and identify patterns"""
        logger.info("📊 Analyzing market trends...")
        
        # Calculate market metrics
        market_metrics = {
            'total_segments': len(trend_data['market_segment'].unique()),
            'avg_market_size': trend_data['market_size_millions'].mean(),
            'avg_growth_rate': trend_data['growth_rate'].mean(),
            'avg_adoption_rate': trend_data['adoption_rate'].mean(),
            'total_regions': len(trend_data['region'].unique())
        }
        
        # Segment-wise analysis
        segment_analysis = trend_data.groupby('market_segment').agg({
            'market_size_millions': 'mean',
            'growth_rate': 'mean',
            'adoption_rate': 'mean'
        }).to_dict()
        
        # Regional analysis
        regional_analysis = trend_data.groupby('region').agg({
            'market_size_millions': 'mean',
            'growth_rate': 'mean',
            'adoption_rate': 'mean'
        }).to_dict()
        
        # Trend identification
        trends = []
        high_growth_segments = trend_data[trend_data['growth_rate'] > 0.1]
        if len(high_growth_segments) > 0:
            trends.append(f"{len(high_growth_segments)} high-growth segments identified")
        
        high_adoption_regions = trend_data[trend_data['adoption_rate'] > 0.6]
        if len(high_adoption_regions) > 0:
            trends.append(f"{len(high_adoption_regions)} high-adoption regions identified")
        
        return {
            'market_metrics': market_metrics,
            'segment_analysis': segment_analysis,
            'regional_analysis': regional_analysis,
            'trends': trends,
            'timestamp': datetime.now().isoformat()
        }
    
    def analyze_competitors(self, competitor_data: pd.DataFrame) -> Dict[str, Any]:
        """Analyze competitive landscape"""
        logger.info("🏆 Analyzing competitive landscape...")
        
        # Competitive metrics
        competitive_metrics = {
            'total_competitors': len(competitor_data),
            'avg_market_share': competitor_data['market_share'].mean(),
            'avg_revenue': competitor_data['revenue_millions'].mean(),
            'avg_growth_rate': competitor_data['growth_rate'].mean(),
            'threat_count': len(competitor_data[competitor_data['is_threat'] == True])
        }
        
        # Competitor analysis by strategy
        strategy_analysis = competitor_data.groupby('pricing_strategy').agg({
            'market_share': 'mean',
            'revenue_millions': 'mean',
            'growth_rate': 'mean',
            'customer_satisfaction': 'mean'
        }).to_dict()
        
        # Threat analysis
        threats = competitor_data[competitor_data['is_threat'] == True]
        threat_analysis = {
            'high_threat_competitors': len(threats),
            'threat_market_share': threats['market_share'].sum() if len(threats) > 0 else 0,
            'threat_growth_rate': threats['growth_rate'].mean() if len(threats) > 0 else 0
        }
        
        # Competitive recommendations
        recommendations = []
        if competitive_metrics['avg_market_share'] > 0.1:
            recommendations.append("High market concentration - focus on differentiation")
        if threat_analysis['threat_market_share'] > 0.3:
            recommendations.append("Significant competitive threats - develop competitive advantages")
        
        return {
            'competitive_metrics': competitive_metrics,
            'strategy_analysis': strategy_analysis,
            'threat_analysis': threat_analysis,
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat()
        }
    
    def forecast_demand(self, demand_data: pd.DataFrame, forecast_periods: int = 12) -> Dict[str, Any]:
        """Forecast market demand"""
        logger.info(f"🔮 Forecasting demand for {forecast_periods} periods...")
        
        # Calculate demand metrics
        demand_metrics = {
            'current_demand': demand_data['demand_volume'].mean(),
            'predicted_demand': demand_data['predicted_demand'].mean(),
            'demand_growth': (demand_data['predicted_demand'].mean() - demand_data['demand_volume'].mean()) / demand_data['demand_volume'].mean(),
            'price_sensitivity': demand_data['price_sensitivity'].mean(),
            'seasonal_variation': demand_data['seasonal_factor'].std()
        }
        
        # Segment-wise demand forecast
        segment_forecast = demand_data.groupby('market_segment').agg({
            'demand_volume': 'mean',
            'predicted_demand': 'mean',
            'price_sensitivity': 'mean'
        }).to_dict()
        
        # Generate future forecasts
        future_forecasts = []
        for i in range(forecast_periods):
            base_demand = demand_metrics['current_demand']
            growth_factor = 1 + (demand_metrics['demand_growth'] * (i + 1) / 12)
            seasonal_factor = 1 + 0.1 * np.sin(2 * np.pi * i / 12)  # Seasonal variation
            forecast = base_demand * growth_factor * seasonal_factor
            
            future_forecasts.append({
                'period': i + 1,
                'forecasted_demand': float(forecast),
                'growth_rate': float(growth_factor - 1),
                'confidence_interval': [float(forecast * 0.9), float(forecast * 1.1)]
            })
        
        return {
            'demand_metrics': demand_metrics,
            'segment_forecast': segment_forecast,
            'future_forecasts': future_forecasts,
            'forecast_periods': forecast_periods,
            'timestamp': datetime.now().isoformat()
        }
    
    def optimize_pricing_strategy(self, pricing_data: pd.DataFrame) -> Dict[str, Any]:
        """Optimize pricing strategies"""
        logger.info("💰 Optimizing pricing strategy...")
        
        # Pricing metrics
        pricing_metrics = {
            'avg_current_price': pricing_data['current_price'].mean(),
            'avg_competitor_price': pricing_data['competitor_price'].mean(),
            'avg_cost': pricing_data['cost_of_production'].mean(),
            'avg_profit_margin': pricing_data['profit_margin'].mean(),
            'price_competitiveness': pricing_data['current_price'].mean() / pricing_data['competitor_price'].mean()
        }
        
        # Segment-wise pricing analysis
        segment_pricing = pricing_data.groupby('market_segment').agg({
            'current_price': 'mean',
            'competitor_price': 'mean',
            'profit_margin': 'mean',
            'market_share': 'mean'
        }).to_dict()
        
        # Pricing recommendations
        recommendations = []
        if pricing_metrics['price_competitiveness'] > 1.1:
            recommendations.append("Prices are higher than competitors - consider price optimization")
        elif pricing_metrics['price_competitiveness'] < 0.9:
            recommendations.append("Prices are lower than competitors - opportunity for price increase")
        
        if pricing_metrics['avg_profit_margin'] < 0.2:
            recommendations.append("Low profit margins - optimize cost structure or increase prices")
        
        # Optimal pricing calculation
        optimal_pricing = pricing_data.copy()
        optimal_pricing['recommended_price'] = optimal_pricing['cost_of_production'] * (1 + 0.3)  # 30% markup
        optimal_pricing['price_adjustment'] = optimal_pricing['recommended_price'] - optimal_pricing['current_price']
        
        return {
            'pricing_metrics': pricing_metrics,
            'segment_pricing': segment_pricing,
            'recommendations': recommendations,
            'optimal_pricing': optimal_pricing[['market_segment', 'current_price', 'recommended_price', 'price_adjustment']].to_dict('records'),
            'timestamp': datetime.now().isoformat()
        }
    
    def identify_market_opportunities(self, market_data: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Identify new market opportunities"""
        logger.info("🎯 Identifying market opportunities...")
        
        opportunities = []
        
        # High-growth segments
        trend_data = market_data['trend_data']
        high_growth_segments = trend_data[trend_data['growth_rate'] > 0.1]
        for _, segment in high_growth_segments.iterrows():
            opportunities.append({
                'type': 'High-Growth Segment',
                'segment': segment['market_segment'],
                'growth_rate': segment['growth_rate'],
                'opportunity_score': segment['growth_rate'] * segment['adoption_rate'],
                'recommendation': f"Enter {segment['market_segment']} segment with differentiated offering"
            })
        
        # Underserved regions
        low_adoption_regions = trend_data[trend_data['adoption_rate'] < 0.4]
        for _, region in low_adoption_regions.iterrows():
            opportunities.append({
                'type': 'Underserved Region',
                'region': region['region'],
                'adoption_rate': region['adoption_rate'],
                'opportunity_score': (1 - region['adoption_rate']) * region['market_size_millions'] / 1000,
                'recommendation': f"Expand into {region['region']} region with market education"
            })
        
        # Competitive gaps
        competitor_data = market_data['competitor_data']
        low_competition_segments = competitor_data[competitor_data['market_share'] < 0.05]
        for _, competitor in low_competition_segments.iterrows():
            opportunities.append({
                'type': 'Competitive Gap',
                'segment': 'General Market',
                'gap_size': 1 - competitor['market_share'],
                'opportunity_score': (1 - competitor['market_share']) * competitor['revenue_millions'],
                'recommendation': f"Target market share from {competitor['competitor_name']}"
            })
        
        # Sort by opportunity score
        opportunities.sort(key=lambda x: x['opportunity_score'], reverse=True)
        
        return {
            'total_opportunities': len(opportunities),
            'opportunities': opportunities[:5],  # Top 5 opportunities
            'timestamp': datetime.now().isoformat()
        }
    
    def generate_market_report(self, data: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Generate comprehensive market analysis report"""
        logger.info("📋 Generating comprehensive market analysis report...")
        
        # Run all analyses
        trend_analysis = self.analyze_market_trends(data['trend_data'])
        competitor_analysis = self.analyze_competitors(data['competitor_data'])
        demand_forecast = self.forecast_demand(data['demand_data'])
        pricing_optimization = self.optimize_pricing_strategy(data['pricing_data'])
        market_opportunities = self.identify_market_opportunities(data)
        
        # Compile comprehensive report
        report = {
            'report_date': datetime.now().isoformat(),
            'trend_analysis': trend_analysis,
            'competitor_analysis': competitor_analysis,
            'demand_forecast': demand_forecast,
            'pricing_optimization': pricing_optimization,
            'market_opportunities': market_opportunities,
            'executive_summary': self._generate_market_summary(
                trend_analysis, competitor_analysis, demand_forecast, pricing_optimization
            ),
            'strategic_recommendations': self._generate_strategic_recommendations(
                trend_analysis, competitor_analysis, demand_forecast, pricing_optimization, market_opportunities
            )
        }
        
        return report
    
    def _generate_market_summary(self, trends: Dict, competitors: Dict, demand: Dict, pricing: Dict) -> str:
        """Generate market analysis summary"""
        summary = f"""
        Healthcare Market Analysis Summary
        
        Market Trends:
        - Total market segments: {trends['market_metrics']['total_segments']}
        - Average market size: ${trends['market_metrics']['avg_market_size']:.0f}M
        - Average growth rate: {trends['market_metrics']['avg_growth_rate']:.1%}
        
        Competitive Landscape:
        - Total competitors: {competitors['competitive_metrics']['total_competitors']}
        - Average market share: {competitors['competitive_metrics']['avg_market_share']:.1%}
        - Threat count: {competitors['competitive_metrics']['threat_count']}
        
        Demand Forecast:
        - Current demand: {demand['demand_metrics']['current_demand']:.0f}
        - Predicted growth: {demand['demand_metrics']['demand_growth']:.1%}
        - Price sensitivity: {demand['demand_metrics']['price_sensitivity']:.2f}
        
        Pricing Analysis:
        - Average current price: ${pricing['pricing_metrics']['avg_current_price']:.0f}
        - Price competitiveness: {pricing['pricing_metrics']['price_competitiveness']:.2f}
        - Average profit margin: {pricing['pricing_metrics']['avg_profit_margin']:.1%}
        """
        
        return summary
    
    def _generate_strategic_recommendations(self, trends: Dict, competitors: Dict, 
                                         demand: Dict, pricing: Dict, opportunities: Dict) -> List[str]:
        """Generate strategic business recommendations"""
        recommendations = []
        
        # High priority recommendations
        if trends['market_metrics']['avg_growth_rate'] > 0.08:
            recommendations.append("HIGH: Invest in high-growth market segments")
        
        if competitors['competitive_metrics']['threat_count'] > 2:
            recommendations.append("HIGH: Develop competitive differentiation strategies")
        
        if demand['demand_metrics']['demand_growth'] > 0.05:
            recommendations.append("MEDIUM: Scale operations to meet growing demand")
        
        if pricing['pricing_metrics']['price_competitiveness'] > 1.1:
            recommendations.append("MEDIUM: Optimize pricing strategy for better competitiveness")
        
        if opportunities['total_opportunities'] > 3:
            recommendations.append("MEDIUM: Pursue identified market opportunities")
        
        return recommendations
    
    def get_model_status(self) -> Dict[str, Any]:
        """Get status of all models"""
        status = {}
        
        for model_name, model in self.models.items():
            status[model_name] = {
                'loaded': model is not None,
                'model_type': type(model).__name__ if model else None
            }
        
        return {
            'total_models': len(self.models),
            'loaded_models': sum(1 for m in self.models.values() if m is not None),
            'model_status': status,
            'timestamp': datetime.now().isoformat()
        }

if __name__ == "__main__":
    # Test MarketAgent
    agent = MarketAgent()
    
    # Generate synthetic data
    data = agent.generate_synthetic_market_data(5000)
    
    # Generate market report
    report = agent.generate_market_report(data)
    
    print("MarketAgent Test Results:")
    print(report['executive_summary'])
    print(f"Strategic Recommendations: {report['strategic_recommendations']}") 