#!/usr/bin/env python3
"""
NC MSF Class Finder - FundFive Scraper with Supabase Integration
Scrapes FundFive colleges and saves directly to Supabase
"""

import requests
import json
import re
import os
from datetime import datetime
from typing import List, Dict
import logging
from bs4 import BeautifulSoup
from supabase import create_client, Client

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Get Supabase credentials from environment variables
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY environment variables")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ============================================================================
# FUNDFIVE COLLEGES
# ============================================================================

FUNDFIVE_COLLEGES = [
    {
        'name': 'Alamance Community College',
        'subdomain': 'alamance',
        'filter': 'motorcycle-safety',
        'city': 'Graham',
        'zipcode': '27253',
        'latitude': 36.0693,
        'longitude': -79.4003
    },
    {
        'name': 'Blue Ridge Community College',
        'subdomain': 'blueridge',
        'filter': 'motorcyle-training',
        'city': 'Flat Rock',
        'zipcode': '28731',
        'latitude': 35.2730,
        'longitude': -82.4362
    },
    {
        'name': 'Brunswick Community College',
        'subdomain': 'brunswickcc',
        'filter': 'motorcycle',
        'city': 'Supply',
        'zipcode': '28462',
        'latitude': 34.0932,
        'longitude': -78.2389
    },
    {
        'name': 'Cape Fear Community College',
        'subdomain': 'cfcc',
        'filter': 'motorcycle',
        'city': 'Wilmington',
        'zipcode': '28401',
        'latitude': 34.2257,
        'longitude': -77.9447
    },
    {
        'name': 'Coastal Carolina Community College',
        'subdomain': 'albemarle',
        'filter': None,
        'city': 'Jacksonville',
        'zipcode': '28546',
        'latitude': 34.7540,
        'longitude': -77.4302
    },
    {
        'name': 'Sandhills Community College',
        'subdomain': 'spcc',
        'filter': 'motorcycle',
        'city': 'Pinehurst',
        'zipcode': '28374',
        'latitude': 35.1743,
        'longitude': -79.4603
    },
]

class FundFiveScraper:
    """Scraper for FundFive-based college registration systems"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'MSFinder Bot 1.0 (+https://yoursite.com/about)',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'en-US,en;q=0.9',
        })
    
    def get_or_create_college(self, college_info: Dict) -> int:
        """Get college ID from Supabase or create if doesn't exist"""
        try:
            # Try to find existing college
            result = supabase.table('colleges').select('id').eq('name', college_info['name']).execute()
            
            if result.data:
                return result.data[0]['id']
            
            # Create new college
            result = supabase.table('colleges').insert({
                'name': college_info['name'],
                'city': college_info['city'],
                'zipcode': college_info['zipcode'],
                'latitude': college_info['latitude'],
                'longitude': college_info['longitude']
            }).execute()
            
            return result.data[0]['id']
            
        except Exception as e:
            logger.error(f"Error getting/creating college: {e}")
            return None
    
    def scrape_college(self, college: Dict) -> int:
        """Scrape courses from a FundFive college and save to Supabase"""
        base_url = f"https://{college['subdomain']}-register.fundfive.com"
        api_url = f"{base_url}/loadcourses"
        
        params = {
            'start': 0,
            'length': 100,
            'url': college['filter'] if college['filter'] else '',
            'layout_type': 'public'
        }
        
        try:
            logger.info(f"Scraping {college['name']}...")
            
            # Get college ID
            college_id = self.get_or_create_college(college)
            if not college_id:
                logger.error(f"Could not get college ID for {college['name']}")
                return 0
            
            # Fetch courses
            response = self.session.get(api_url, params=params, timeout=10)
            
            if response.status_code != 200:
                logger.error(f"HTTP {response.status_code} for {college['name']}")
                return 0
            
            data = response.json()
            course_data = data.get('data', [])
            
            # Delete old courses for this college
            supabase.table('courses').delete().eq('college_id', college_id).execute()
            
            courses_saved = 0
            
            for row in course_data:
                try:
                    # Parse course data
                    title_html = row[0]
                    soup = BeautifulSoup(title_html, 'html.parser')
                    link = soup.find('a')
                    
                    title = link.get_text(strip=True) if link else 'Motorcycle Safety Course'
                    course_url = link['href'] if link and link.get('href') else ''
                    
                    # Extract section ID
                    section_id = ''
                    if course_url:
                        match = re.search(r'/section/(\d+)', course_url)
                        if match:
                            section_id = match.group(1)
                    
                    # Parse location
                    location_html = row[1]
                    location_soup = BeautifulSoup(location_html, 'html.parser')
                    location_text = location_soup.get_text(separator=' ', strip=True)
                    
                    # Parse date and time
                    start_date = row[2]
                    start_time = row[3]
                    price = row[4]
                    
                    # Parse seats
                    seats_data = row[5]
                    if isinstance(seats_data, int):
                        seats_available = seats_data
                        waitlist = False
                    else:
                        seats_available = 0
                        waitlist = 'Wait List' in str(seats_data)
                    
                    # Convert date format from MM/DD/YYYY to YYYY-MM-DD
                    try:
                        date_obj = datetime.strptime(start_date, '%m/%d/%Y')
                        start_date_formatted = date_obj.strftime('%Y-%m-%d')
                    except:
                        start_date_formatted = None
                    
                    # Insert course into Supabase
                    supabase.table('courses').insert({
                        'college_id': college_id,
                        'section_id': section_id,
                        'course_code': 'MSF-BRC',
                        'title': title,
                        'start_date': start_date_formatted,
                        'start_time': start_time,
                        'location': location_text,
                        'seats_available': seats_available,
                        'seats_total': 12,  # Standard MSF class size
                        'price': price,
                        'waitlist_available': waitlist,
                        'registration_url': course_url if course_url.startswith('http') else f"{base_url}{course_url}"
                    }).execute()
                    
                    courses_saved += 1
                    
                except Exception as e:
                    logger.warning(f"Error parsing course: {e}")
                    continue
            
            logger.info(f"Saved {courses_saved} courses for {college['name']}")
            return courses_saved
            
        except Exception as e:
            logger.error(f"Error scraping {college['name']}: {e}")
            return 0
    
    def scrape_all(self):
        """Scrape all FundFive colleges"""
        total_courses = 0
        successful = 0
        failed = 0
        
        for college in FUNDFIVE_COLLEGES:
            try:
                count = self.scrape_college(college)
                if count > 0:
                    total_courses += count
                    successful += 1
                else:
                    failed += 1
            except Exception as e:
                logger.error(f"Failed to scrape {college['name']}: {e}")
                failed += 1
        
        return {
            'total_colleges': len(FUNDFIVE_COLLEGES),
            'successful': successful,
            'failed': failed,
            'total_courses': total_courses
        }

def main():
    """Main execution"""
    print("=" * 80)
    print("NC MSF Class Finder - FundFive Scraper → Supabase")
    print("=" * 80)
    print()
    
    scraper = FundFiveScraper()
    results = scraper.scrape_all()
    
    print()
    print("=" * 80)
    print("✅ SCRAPING COMPLETE!")
    print("=" * 80)
    print(f"Colleges attempted: {results['total_colleges']}")
    print(f"Successful: {results['successful']}")
    print(f"Failed: {results['failed']}")
    print(f"Total courses saved to Supabase: {results['total_courses']}")
    print()

if __name__ == "__main__":
    main()
