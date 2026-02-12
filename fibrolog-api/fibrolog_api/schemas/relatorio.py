from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel


class GeneralSummary(BaseModel):
    """General summary of symptoms in the period."""
    averagePain: float
    peakPain: int
    intensePainDays: int
    averageFatigue: float
    averageSleep: float
    emotionFrequency: Dict[str, int]


class PainRegionSummary(BaseModel):
    """Summary of pain region occurrences."""
    id: str
    count: int


class SymptomTimelineEntry(BaseModel):
    """Chronological entry for daily symptoms."""
    date: datetime
    pain: Optional[int] = None
    fatigue: Optional[int] = None
    sleep: Optional[int] = None
    emotion: Optional[str] = None
    notes: Optional[str] = None


class CrisisReportEntry(BaseModel):
    """Chronological entry for crises."""
    timestamp: datetime
    intensity: int
    duration: Optional[str] = None
    symptoms: Optional[str] = None
    context: Optional[str] = None


class ReportPublic(BaseModel):
    """Main schema for the consolidated report."""
    patientName: str
    period: str
    generationDate: datetime
    generalSummary: GeneralSummary
    frequentPainRegions: List[PainRegionSummary]
    symptomTimeline: List[SymptomTimelineEntry]
    crisisHistory: List[CrisisReportEntry]
