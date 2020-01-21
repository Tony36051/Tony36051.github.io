---
title: 亚马逊自动下单 Selenium 自动化
date: 2018-08-21
tag: 
- python
- Selenium
categories:
- Test
---
朋友老婆做亚马逊电商，总有人跟卖，做一个自动下单的工具，将部分入门的跟卖卖家的库存给买掉。新建账号，虚假付款信息，订单可以锁定数个小时。主要的诉求就是从注册购物付款，全自动。接口自动化因为安全和加密的原因，分析起来比较费劲，所以使用的GUI的自动化，选型用的是熟悉的Selenium而没用 puppeteer
<!--more-->

# 亚马逊自动下单 Selenium 自动化

## 业务流程

跟大部分工程一样，都是从业务流程开始，有一个清楚的流程，能很好指导代码开发。

比如新注册用户会提示是否使用prime账号，如果研究业务流程的时候用老号就发现不了。自动化中间多出一个页面，就走不下去了

## Page Object 山寨版

没有完全使用标准的Page Object设计模式，只是将xpath提取为变量，在部分重复的页面（很少）抽象出有业务含义的动作。比如下面的填写收货地址

```python
class Address(BaseSelenium):
    ADDRESS_BOOK_ENTRY_XPATH = "//div[@id='address-book-entry-0']"
    DELIVER_BUTTON_PATH = ADDRESS_BOOK_ENTRY_XPATH + "/div[contains(@class,'ship-to-this-address')]/span/a"
    FULL_NAME_INPUT_XPATH = "(//form)[1]//input[@id='enterAddressFullName']"
    ADDR_LINE_1_INPUT_XPATH = "(//form)[1]//input[@id='enterAddressAddressLine1']"
    CITY_INPUT_XPATH = "(//form)[1]//input[@id='enterAddressCity']"
    PROVINCE_SELECT_PATH = "(//form)[1]//select[@id='enterAddressStateOrRegion']"
    PROVINCE_OPTION_PATH = "(//form)[1]//select[@id='enterAddressStateOrRegion']/option[text()='{}']"
    POSTAL_INPUT_XPATH = "(//form)[1]//input[@id='enterAddressPostalCode']"
    TEL_INPUT_ID = "(//form)[1]//input[@id='enterAddressPhoneNumber']"
    SHIP_TO_THIS_ADDR = "(//form)[1]//input[@name='shipToThisAddress']"
    SHIPPING_OPTIONS_CONTINUE_BUTTON = "(//input[@type='submit'])[1]"

    def __init__(self, driver):
        super().__init__(driver)

        self.cf = configparser.ConfigParser()
        self.cf.read('config.ini')
        self.name = self.cf.get("buyer", "name")
        self.address = self.cf.get("buyer", "address")
        self.city = self.cf.get("buyer", "city")
        self.province = self.cf.get("buyer", "province")
        self.post = self.cf.get("buyer", "post")
        self.tel = self.cf.get("buyer", "tel")


    def enter_shipping_address(self):
        logger = get_logger('addr')
        if self._check_exists_by_xpath_with_wait(Address.ADDRESS_BOOK_ENTRY_XPATH, self.checking_wait):
            logger.info("选择已有的地址")
            self._click_by_xpath(Address.DELIVER_BUTTON_PATH)
        else:
            logger.info("填写送货地址")
            self._input_by_xpath(Address.FULL_NAME_INPUT_XPATH, self.name)
            self._input_by_xpath(Address.ADDR_LINE_1_INPUT_XPATH, self.address)
            self._input_by_xpath(Address.CITY_INPUT_XPATH, self.city)
            self._input_by_xpath(Address.POSTAL_INPUT_XPATH, self.post)
            self._input_by_xpath(Address.TEL_INPUT_ID, self.tel)
            self._click_by_xpath(Address.PROVINCE_SELECT_PATH)
            self._click_by_xpath(Address.PROVINCE_OPTION_PATH.format(self.province))
            self._click_by_xpath(Address.SHIP_TO_THIS_ADDR)
        # choose your shipping options
        logger.info("送货信息完毕，点击继续")
        self._click_by_xpath(Address.SHIPPING_OPTIONS_CONTINUE_BUTTON)
```

## Selenium 简单封装

大部分操作都是点击和输入，还有大量就是判断页面元素是否存在。

又因为亚马逊是海外网站，访问速度非常感人，也很不稳定，所以在等待条件上也需要非常小心设计，大部分debug时间都在处理等待问题。

本来看着页面设计基本都有id和name，打算偷懒不用xpath，后面发现复杂的页面元素还是xpath出马，适用面广，以后再有这样的工程，就一个xpath打天下算了。

设计了两个超时时间，`implicitly_wait`和`checking_wait`，一个是默认的等待时间，用于等待页面加载一会需要操作的元素，另一个是用来检查元素是否存在，判断当前页面究竟是哪个，这种情况通常页面已经基本加载完成，所以比前者短一些。

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-
import configparser

from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait


class BaseSelenium(object):
    def __init__(self, driver):
        self._driver = driver
        self.cf = configparser.ConfigParser()
        self.cf.read('config.ini')
        self.implicitly_wait = int(self.cf.get("selenium", "implicitly_wait"))
        self.checking_wait = int(self.cf.get("selenium", "checking_wait"))

    def _wait_and_get_element_by_id(self, id, wait_in_sec=None):
        return WebDriverWait(self._driver, wait_in_sec if wait_in_sec else self.implicitly_wait).until(
            EC.visibility_of_element_located((By.ID, id)))

    def _wait_and_get_element_by_xpath(self, xpath, wait_in_sec=None):
        return WebDriverWait(self._driver, wait_in_sec if wait_in_sec else self.implicitly_wait).until(
            EC.visibility_of_element_located((By.XPATH, xpath)))

    def _check_exists_by_id_without_wait(self, id):
        try:
            self._driver.find_element_by_id(id)
        except NoSuchElementException:
            return False
        return True

    def _check_exists_by_xpath_with_wait(self, xpath, wait_in_sec=None):
        try:
            WebDriverWait(self._driver, wait_in_sec if wait_in_sec else self.implicitly_wait).until(
                EC.visibility_of_element_located((By.XPATH, xpath)))
        except (NoSuchElementException, TimeoutException):
            return False
        return True

    def _input_by_id(self, id, text):
        element = self._wait_and_get_element_by_id(id)
        element.send_keys(text)

    def _click_by_id(self, id):
        element = self._wait_and_get_element_by_id(id)
        element.click()

    def _input_by_xpath(self, xpath, text):
        element = self._wait_and_get_element_by_xpath(xpath)
        element.send_keys(text)

    def _click_by_xpath(self, xpath):
        element = self._wait_and_get_element_by_xpath(xpath)
        element.click()

    def go_url(self, url):
        self._driver.get(url)

    def get_url(self):
        return self._driver.current_url

    def _wait_until_clickable_by_xpath(self, xpath, wait_in_sec=None):
        try:
            WebDriverWait(self._driver, wait_in_sec if wait_in_sec else self.implicitly_wait).until(
                EC.element_to_be_clickable((By.XPATH, xpath)))
        except (NoSuchElementException, TimeoutException):
            return False
        return True

    def _get_element_attribute_by_xpath(self, xpath, attr_name, wait_in_sec=None):
        element = self._wait_and_get_element_by_xpath(xpath, wait_in_sec)
        return element.get_attribute(attr_name)
```

## 获取邮箱OTP一次性密码

自建邮件服务最方便，然后要多少账号就有多少账号，免注册邮箱。

用pop3协议，多次拉取确保最新邮件，用正则匹配6位数字就可以获得。

虽然设计3次最大重试次数，但是没触发过。

## 数据存储

程序的配置项，打码平台的账号密码，永远一样的收货地址就放`config.ini`。每次都要更新的卖家和商品就放`pin.xlsx`

## 异常处理

GUI自动化遇到异常的机会非常大，定义错误码（错误状态）往上层传递很重要。

用try-exception控制异常减少程序提前结束是非常必要的。

## 打码平台

验证码自己识别太难了，接入打码平台也不贵。500条1元试用，小包月也是几十块，够打了。

如果使用requests等库处理图片的保存，一定要**设置超时**，因为amazon有些云计算服务（图片）的链接一直打不开，程序表现就是卡死。

## 浏览器优化

主要流程打通后，不再需要观察页面元素而是通过日志来观察程序的流程时，可以尽情打开加速的配置了。

关闭图片加载，开启无头模式等，都能大大地加快程序运行时间，我觉得个puppeteer应该差不远了。

无头模式一定要设置窗口大小，不然默认的大小会让元素在窗口范围内不可见，所有等待条件都失败，具体表现为程序卡住一动不动，其实是在等待元素出现在窗口范围。

```python
def open_chrome_driver(buyer: Buyer):
    chrome_options = Options()
    if ConfigUtil.get_config_value_by_section_key_as_str("selenium", "headless").strip().upper() == "TRUE":
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--window-size=1080,3000')
    # 不加载图片
    if ConfigUtil.get_config_value_by_section_key_as_str("selenium", "disable_pic").strip().upper() == "TRUE":
        prefs = {
            'profile.default_content_setting_values': {
                'images': 2,
            }
        }
        chrome_options.add_experimental_option('prefs', prefs)
        chrome_options.add_argument('blink-settings=imagesEnabled=false')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')  # 谷歌文档提到需要加上这个属性来规避bug
    with chrome_driver_lock:  # 同时打开chrome会报错，尽管user-data-dir不一样
        driver = webdriver.Chrome(options=chrome_options)
    return driver
```



## 并发

因为要求支持并发，以达到更快的买光库存，需要考虑的东西就多了

### 同步

使用多线程模型，没有用异步。

因为我是先完成了单线程版本，后续想修改少一些，用装饰器做同步控制

```python
def synchronized_self(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        with BuyerManager.lock:
            return func(*args, **kwargs)

    return wrapper

class BuyerManager(object):
    lock = threading.Lock()
 	
    @synchronized_self
    def get_candidate_buyers(self):
        if config_util.ConfigUtil.buyer_account_use_only_once():
            valid_buyers = [x for x in self.buyers if not x.banned and not x.registered]
        else:
            valid_buyers = [x for x in self.buyers if not x.banned]
        assert len(valid_buyers) > 0, '已无买家，程序结束'
        return valid_buyers

```

在打开的浏览器的时候，如果同时打开会造成会话错乱。明明已经做了数据目录的区分，同时看了源代码，每个会话也是独立的，但是不知道为什么后面还是串操作，input到了同个浏览器的会话。所以打开浏览器的时候，做了锁控制同步

```python
    with chrome_driver_lock:  # 同时打开chrome会报错，尽管user-data-dir不一样
        driver = webdriver.Chrome(options=chrome_options
                                  # , desired_capabilities=capabilities
                                  )
```

## 线程池

多线程不难，难的是要将每个线程划分清楚。什么时候可以终止

入参做好同步控制，不要重复。当某一个卖家已经没有库存了，此时线程池内其他线程都应该关掉收工了。但是线程开始了，比较难关闭，除非pthread等方式包装一层。此处只是把线程池中未开始的等待线程取消了。

假如线程池可以同时4个线程（abcd），当b率先完成任务，此时线程池内是aecd，后续的fghijk...都会被取消掉，可惜aecd这四个还是要继续执行。

```python
def buy_all(xlsx_file):
    logger = get_logger("buy_all")
    bm = BuyerManager(xlsx_file)
    sm = SellerManager(xlsx_file)
    sellers = sm.get_sellers()
    for cur_seller in sellers:
        logger.info("正在处理卖家{}@{}".format(cur_seller.sku, cur_seller.name))
        with ThreadPoolExecutor(ConfigUtil.thread_num(), thread_name_prefix='pool') as pool:
            result_list = [pool.submit(buy_one, cur_seller, x, bm) for x in bm.get_candidate_buyers()]
            logger.info("买家{}个-->卖家{}@{}".format(len(result_list), cur_seller.sku, cur_seller.name))
            for future in as_completed(result_list):
                if not future.cancelled():
                    result = future.result()
                    logger.info("某一购买流程结束：{}".format(result))
                    if result is not None and result == PurchaseFlow.NO_STOCK:
                        logger.info("卖家{}@{}已无库存，取消未执行的购买流程，已经开始的购买流程无法提前结束"
                                    .format(cur_seller.sku, cur_seller.name))
                        sm.set_seller_sold_out(cur_seller)
                        [x.cancel() for x in result_list]
                        break
            logger.info("线程池结束shutdown")
```

## 网速

现在pc性能已经很好，但是出过带宽还是太小，以至于虽然想更快，开更多线程，但是开多了，页面元素加载就更加慢了，最终导致失败的机会更加大。

## 日志

多线程或者或多进程后，日志打印会非常混乱，一般来说都按照线程来将日志打印到文件中。但是有部分公共服务的日志怎么知道是哪个线程的呢？

当前版本是每个方法中获取日志对象，根据线程的关键数据（买家名字）来起名。其实用传递日志对象应该更加合适

