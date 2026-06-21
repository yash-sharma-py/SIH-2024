import folium
import pandas as pd
import geopandas as gpd

# Load NO₂ data
no2_data = pd.read_csv('no2_data.csv')

# Load GeoJSON for India's states
geo_data = gpd.read_file('india_states_geojson.json')

# Merge NO₂ data with GeoJSON data
merged_data = geo_data.set_index('state_name').join(no2_data.set_index('state_name'))

# Initialize the map
m = folium.Map(location=[20.5937, 78.9629], zoom_start=5)

# Define a function to style the map
def style_function(feature):
    return {
        'fillColor': '#ff7800',
        'weight': 2,
        'opacity': 0.5,
        'color': 'black',
        'dashArray': '3'
    }

# Add GeoJSON data to the map
folium.GeoJson(
    merged_data,
    style_function=style_function,
    tooltip=folium.Tooltip(fields=['state_name', 'NO2_value'])
).add_to(m)

# Save the map to an HTML file
m.save('india_no2_chloromap.html')
