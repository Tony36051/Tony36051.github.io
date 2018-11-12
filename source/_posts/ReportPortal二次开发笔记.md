---
title: ReportPortal二次开发笔记
date: 2018-10-25
tag: 
- 测试
---
ReportPortal二次开发中, 记录一些考量
<!--more-->
## 关联取数据
db查询
```js
db.getCollection('launch').aggregate([
    {// 筛选launch, strID筛选新数据, 项目名, launch+test名模糊匹配 
        $match: { launchId: {$exists:true} , projectRef:"cco1", name: {$regex: /PO/}}
    },
    {// 去掉不用的字段 
        $project:{_id:0, launchId:1, projectRef: 1, name:1}
    },
    {// 关联item
        $lookup:
        {
            from: 'testItem',
            localField: 'launchId',
            foreignField: 'launchRef',
            as: 'inner_item'
        }
    }, 
    {// 展开数组
        $unwind: "$inner_item"
    },
    {// 只取最底层步骤, 失败的步骤
        $match: {'inner_item.has_childs':false, 'inner_item.itemId': {$exists:true}, 'inner_item.status': 'FAILED'}
    },
    {// 嵌套item提升到根文档
        $addFields:{itemId: "$inner_item.itemId", "itemName": "$inner_item.name", "itemStatus": "$inner_item.status", "itemDesc": "$inner_item.itemDescription"}
    },
    {// 去掉嵌套文档
		$project: {inner_item:0}
    },
    {// 关联log
        $lookup:
        {
            from: 'log',
            localField: 'itemId',
            foreignField: 'testItemRef',
            as: 'inner_log'
        }
    },
    {// 展开log数组为n行
        $unwind: "$inner_log"
    },
    {// 日志级别筛选
        $match: {'inner_log.level.log_level':{$gt:30000}}
    },
    {// 嵌套log提升到根文档
        $addFields: {logMsg: "$inner_log.logMsg", logLevel: "$inner_log.level.log_level"}
    },
    {// 去掉嵌套文档
        $project: {inner_log:0}
    },
    {
        $group: 
        {
            _id: "$logMsg", caselog: {$push: "$$ROOT"}, count: {$sum:1}
        }
    },
    {
        $sort: {"count": -1}
    }
])

```

## 一条用例应该只有一个错误原因
所以在关联日志的时候, 没有AI介入之前, 勉强认为第一个出现的错误即为错误原因.
我的用例为RobotFramework写的GUI和数据库复合用例, 在用例结束之时会尝试去关闭数据库链接和浏览器, 这里会产生失败记录. 如果一个用例可以关联多条日志, 则会影响聚类分析的准确性.

## 日志做groupby的时候, 如果编辑距离小于n认为是一个group 的条件
// TODO
因为有些日志仅有几个字符差距, 本质上是一样的. 
使用topic生成, 编辑距离, 还是什么ai算法可以将 `f(logMsg)-->group cond`??

## 两个let赋值语句build之后并行了
```js
let curUser = window.localStorage.getItem('curUser')
let projectName = window.localStorage.getItem(curUser + '_lastInsideHash')
if (projectName) {
  projectName = projectName.replace(/\/aimark/gi, '').replace(/#/gi, '')
} else {
  projectName = 'wjs-debug'
}
```
这个语句在build之后, 会变成类似以下代码, 导致projectName取不到值
```js
var i=window.localStorage.getItem('curUser'), n=window.localStorage.getItem(curUser + '_lastInsideHash')
```

```python
# -*- coding: utf-8 -*-  
import glob  
import multiprocessing  
  
from robot import rebot  
from robot.conf import RobotSettings  
from robot.model import SuiteVisitor  
from robot.output import LOGGER  
from robot.run import RobotFramework, run, USAGE  
from robot.running import TestSuiteBuilder  
from robot.utils import unic, Application  
import sys  
import os  
import shutil  
import datetime  
import logging  
  
# Syntax sugar.  
_ver = sys.version_info  
is_py2 = (_ver[0] == 2)  #: Python 2.x?  
is_py3 = (_ver[0] == 3)  #: Python 3.x?  
if is_py2:  
    from itertools import izip as zip, repeat  
if is_py3:  
    from itertools import repeat  
  
logging.basicConfig(level=logging.DEBUG,  
  format='%(asctime)s %(threadName)s %(message)s',  
  # format='[%(levelname)s] %(asctime)s (%(threadName)-10s) %(message)s',  
  )  
USAGE_EXT = """ExtOptions  
==========  
 -p --processes num       How many processes to be run.    --rpagent             Listener for RobotFramework to report results to ReportPortal.  
=========="""  
  
  
class Parabot(RobotFramework):  
    def __init__(self):  
        first_half, last_half = USAGE.split("Options\n=======", 1)  
        extended_usage = "\n".join([first_half, USAGE_EXT, last_half])  
        Application.__init__(self, extended_usage, arg_limits=(1,),  
  env_options='ROBOT_OPTIONS', logger=LOGGER)  
        self.output_dir = None  
  self.data_source = None  
  self.long_names = []  
  
    # override  
  def main(self, data_sources, **options):  
  
        settings = RobotSettings(options)  
        LOGGER.register_console_logger(**settings.console_output_config)  
        LOGGER.info("Settings:\n%s" % unic(settings))  
        suite = TestSuiteBuilder(settings['SuiteNames'],  
  settings['WarnOnSkipped'],  
  settings['Extension']).build(*data_sources)  
        suite.configure(**settings.suite_config)  
        self._support_python_path(options)  
        self._split_tests(suite)  # 递归，找到所有的tests, 写入self.long_names  
  self.data_source = self._assert_data_source(data_sources)  # 只支持一个DataSource, 取第一个  
  self.output_dir = settings['OutputDir']  
        self.clean_output_dir()  # 删掉主要输出目录下所有东东rm -rf  
  p_num = int(options['processes']) if 'processes' in options else 2 * multiprocessing.cpu_count()  
        start_time, end_time = self.parallel_run(options, p_num)  
        self.merge_report(start_time, end_time)  
  
    def _support_python_path(self, opts):  
        if self._ap._auto_pythonpath and opts.get('pythonpath'):  
            sys.path = self._ap._get_pythonpath(opts['pythonpath']) + sys.path  
  
    def _split_tests(self, suite):  
        if suite.suites:  
            for sub_suite in suite.suites:  
                self._split_tests(sub_suite)  
        else:  
            for test in suite.tests:  
                self.long_names.append(test.longname)  # 从根的suite到叶的testcase串起来的longname  
  
  @staticmethod  
  def _assert_data_source(data_sources):  
        if len(data_sources) > 1:  
            raise ValueError("Support only ONE data source")  
        return data_sources[0]  
  
    def clean_output_dir(self):  
        path = self.output_dir  
        if os.path.isdir(path) and not os.path.islink(path):  
            shutil.rmtree(path)  
        elif os.path.exists(path):  
            os.remove(path)  
  
    def parallel_run(self, options, p_num):  
        self.debug_info(options)  
        start_time = datetime.datetime.now()  
        logging.info('run \tstart at: {}'.format(start_time))  
  
        multiprocessing.freeze_support()  
        pool = multiprocessing.Pool(processes=p_num)  
  
        pool.map_async(run_robot_star,  
  zip(repeat(options), self.long_names, repeat(self.data_source)))  
        pool.close()  
        pool.join()  
  
        end_time = datetime.datetime.now()  
        logging.info('run \tend at: {}'.format(end_time))  
        logging.info('run \telapsed time: {}'.format(end_time - start_time))  
        return start_time, end_time  
  
    def debug_info(self, options):  
        logging.debug("robot_options:\n" + "\n".join(["{}->{}".format(x[0], x[1]) for x in options.items()]))  
        logging.debug("tests to run:\n" + "\n".join(self.long_names))  
        logging.debug("data_source: " + self.data_source)  
  
    def merge_report(self, start_time, end_time):  
        path = os.path.join(self.output_dir, '*', 'output.xml')  
        outputs = glob.glob(path)  
        options = {  
            "merge": True,  
  "loglevel": "WARN",  
  "starttime": str(start_time),  
  "endtime": str(end_time),  
  "outputdir": self.output_dir,  
  "output": "output.xml"  
  }  
        with open(os.path.join(self.output_dir, 'merge.log'), 'w') as stdout:  
            rebot(*outputs, stdout=stdout, **options)  
  
  
def run_robot_star(options_test_source):  
    """Convert `f((options,test,source))` to `f(options,test, data_source)` call."""  
  return run_robot(*options_test_source)  
  
  
def run_robot(options, test, data_source):  
    sub_dir = os.path.join(options['outputdir'], test)  
    os.makedirs(sub_dir)  
    options['outputdir'] = sub_dir  
    options['report'] = None  
  options['test'] = test  
    options['prerunmodifier'] = TeardownCleaner()  
    stdout = os.path.join(sub_dir, 'stdout.log')  
    stderr = os.path.join(sub_dir, 'stderr.log')  
    rp_options(options)  
    with open(stdout, 'w') as stdout, open(stderr, 'w') as stderr:  
        stdout.write(",".join(test, data_source) + "\n")  
        options['stdout'] = stdout  
        options['stderr'] = stderr  
        ret_code = run(data_source, **options)  
    return ret_code  
  
  
def rp_options(options):  
    if "rpagent" not in options:  
        return options  
    if "variable" not in options:  
        logging.error('Non-variable! So no ReportPortal agent can launch. Running without ReportPortal agent.')  
        return options  
    var_in_str = "".join(options['variable'])  
    keys_to_check = ["RP_UUID", "RP_ENDPOINT", "RP_PROJECT", "RP_LAUNCH"]  
    fail_count = [True if x in var_in_str else False for x in keys_to_check].count(False)  
  
    if fail_count > 0:  
        debug_message = ['{}{} found.'.format(x, '' if x in var_in_str else ' not') for x in keys_to_check]  
        logging.error("ReportPortal agent checking:\n" + "\n".join(debug_message))  
        return options  
    for i, var in enumerate(options['variable']):  
        if str(var).startswith('RP_LAUNCH'):  
            options['variable'][i] = "RP_LAUNCH:" + options['test']  
            # TODO: download agent binary code  
  
  
def run_cli(arguments, exit=True):  
    """Command line execution entry point for running tests.  
  
  :param arguments: Command line options and arguments as a list of strings.  :param exit: If ``True``, call ``sys.exit`` with the return code denoting execution status, otherwise just return the rc. New in RF 3.0.1.  
 Entry point used when running tests from the command line, but can also be used by custom scripts that execute tests. Especially useful if the script itself needs to accept same arguments as accepted by Robot Framework, because the script can just pass them forward directly along with the possible default values it sets itself.  
 Example::  
 from robot import run_cli  
 # Run tests and return the return code. rc = run_cli(['--name', 'Example', 'tests.robot'], exit=False)  
 # Run tests and exit to the system automatically. run_cli(['--name', 'Example', 'tests.robot'])  
 See also the :func:`run` function that allows setting options as keyword arguments like ``name="Example"`` and generally has a richer API for programmatic test execution. """  return Parabot().execute_cli(arguments, exit=exit)  
  
  
if __name__ == '__main__':  
    run_cli(sys.argv[1:])  
  
  
class TeardownCleaner(SuiteVisitor):  
    def end_test(self, test):  
        if not test.keywords.teardown:  
            test.keywords.create(name='Run Keywords', type='teardown',  
  args=['Run Keyword And Ignore Error', 'Close Browser', 'AND',  
  'Run Keyword And Ignore Error', 'Disconnect From Database'])
```
