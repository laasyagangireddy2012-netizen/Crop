# CROPXAI - Dataset Summary

## 📊 Datasets Overview

CROPXAI uses **2 main datasets** merged from agricultural research sources:

### 1. Crop Information Dataset
**File:** `CROPXAI_COMPLETE_DATASET.csv`
- **8 crops** with complete details
- **48 columns** per crop
- **3 languages** (English, Telugu, Hindi)
- **Irrigation schedules** (up to 7 stages)
- **NPK requirements**
- **Market data**

### 2. Soil Parameters Dataset
**File:** `SOIL_PARAMETERS_DATASET.csv`
- **24 soil-climate combinations**
- **13 columns** per combination
- **6 soil types** × **4 climates**
- **pH and NPK ranges**
- **Suitable crops list**

---

## 📁 Files Created

| File | Type | Records | Purpose |
|------|------|---------|---------|
| CROPXAI_COMPLETE_DATASET.csv | CSV | 8 | Complete crop data |
| SOIL_PARAMETERS_DATASET.csv | CSV | 24 | Soil parameters |
| DATASET_DOCUMENTATION.md | Markdown | - | Full documentation |
| DATASET_SUMMARY.md | Markdown | - | This summary |

---

## 🎯 Key Features

### Crop Dataset Includes:
✅ Crop names in 3 languages
✅ Climate and season requirements
✅ Soil type compatibility
✅ pH ranges
✅ NPK (Nitrogen, Phosphorus, Potassium) ranges
✅ Irrigation methods and water requirements
✅ Complete irrigation schedules (7 stages)
✅ Fertilizer recommendations
✅ Market demand and export potential

### Soil Dataset Includes:
✅ Soil type classifications
✅ Climate-specific parameters
✅ Typical pH values
✅ NPK ranges by soil-climate combination
✅ Suitable crops for each combination

---

## 📈 Data Sources

All data compiled from:
- **ICAR** (Indian Council of Agricultural Research)
- **State Agricultural Universities**
- **Agricultural Extension Services**
- **FAO Guidelines**
- **Soil Health Card Scheme**

---

## 💾 How to Use

### In Excel:
1. Open Excel
2. File → Open → Select CSV file
3. Data imports automatically

### In Google Sheets:
1. File → Import
2. Upload CSV
3. Select "Comma" separator

### In Python:
```python
import pandas as pd
crops = pd.read_csv('CROPXAI_COMPLETE_DATASET.csv')
soil = pd.read_csv('SOIL_PARAMETERS_DATASET.csv')
```

---

## 🔍 Quick Stats

**Total Data Points:** 696+
**Crops Covered:** 8
**Languages:** 3
**Soil Types:** 6
**Climate Types:** 4
**Growth Stages:** 42 (across all crops)

---

**Ready to use for analysis, machine learning, or application integration!** 📊✨
