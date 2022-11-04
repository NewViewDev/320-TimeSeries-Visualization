from asyncore import write
import csv
from decimal import Decimal
import random
import datetime
import time
  
ct = datetime.datetime.now()
print("current time:-", ct)
  
ts = ct.timestamp()
print("timestamp:-", ts)


'''
Randomly generate the LMP and override to all the current LMPs.
'''

input_file_name = 'test-output3.5.csv'
output_file_name = 'test-output3.6.csv'


with open(str(input_file_name)) as csvfile, open(str(output_file_name), 'w') as output:
    writer = csv.writer(output, delimiter=',')
    reader = csv.reader(csvfile, delimiter=',')

    line_count = 0
    for row in reader:
        line_count += 1

        if line_count == 1:
            writer.writerow(row)
        else:
            #Generate a float number in range(25.5, 35.5)
            LMP = random.uniform(25.5, 35.5)
            LMP = round(LMP, 2) #round up
            row[3] = str(LMP)
    
            writer.writerow(row)