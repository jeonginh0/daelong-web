# fooddata.py

from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import csv

def scrape_food_data(searchloc):
    url = 'https://map.kakao.com/'
    driver = webdriver.Chrome()  # 드라이버 경로
    driver.get(url)

    # 음식점 입력 후 찾기 버튼
    search_area = driver.find_element(By.XPATH, '//*[@id="search.keyword.query"]')
    search_area.send_keys(searchloc)
    search_area.send_keys(Keys.RETURN)
    time.sleep(2)

    # 장소 버튼
    driver.find_element(By.CSS_SELECTOR, '#info\\.main\\.options > li.option1 > a').click()

    def storeNamePrint(page):
        time.sleep(0.2)

        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')

        store_lists = soup.select('.placelist > .PlaceItem')
        list = []

        for store in store_lists:
            temp = []
            name = store.select('.head_item > .tit_name > .link_name')[0].text
            degree = store.select('.rating > .score > .num')[0].text if store.select('.rating > .score > .num') else 'N/A'
            addr = store.select('.info_item > .addr')[0].text.splitlines()[1] if store.select('.info_item > .addr') else 'N/A'
            tel = store.select('.info_item > .contact > .phone')[0].text if store.select('.info_item > .contact > .phone') else 'N/A'

            print(name, degree, addr, tel, '-')

            temp.append(name)
            temp.append(degree)
            temp.append(addr)
            temp.append(tel)

            list.append(temp)

        if page == 1:
            with open('store_list.csv', 'w', encoding='utf-8-sig', newline='') as f:
                writercsv = csv.writer(f)
                header = ['name', 'degree', 'address', 'tel']
                writercsv.writerow(header)
                writercsv.writerows(list)
        else:
            with open('store_list.csv', 'a', encoding='utf-8-sig', newline='') as f:
                writercsv = csv.writer(f)
                writercsv.writerows(list)

    storeNamePrint(1)
    try:
        # 장소 더보기 버튼 누르기
        btn = driver.find_element(By.CSS_SELECTOR, '.more')
        driver.execute_script("arguments[0].click();", btn)
        time.sleep(2)

        for i in range(2, 6):
            # 페이지 넘기기
            xPath = f'//*[@id="info.search.page.no{i}"]'
            driver.find_element(By.XPATH, xPath).send_keys(Keys.ENTER)
            time.sleep(2)

            storeNamePrint(i)
    except Exception as e:
        print('ERROR:', e)
    finally:
        driver.quit()

    print('**크롤링 완료**')
