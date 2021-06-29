'''
    计量器。
    by z0gSh1u @ 2021-02
'''

class AverageMeter():
    """滚动平均计量器"""    
    def __init__(self):
        self.reset()

    def reset(self):
        """重设计量器 """        
        self.val = 0
        self.avg = 0
        self.sum = 0
        self.count = 0

    def update(self, val):
        """进行一次观测"""        
        self.val = val
        self.sum += val
        self.count += 1
        self.avg = self.sum / self.count

    def get_value(self):
        """获取观测结果"""        
        return self.avg
