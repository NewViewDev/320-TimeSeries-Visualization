from asyncore import write
import csv
from decimal import Decimal
import random
import datetime
import time;
  
ct = datetime.datetime.now()
print("current time:-", ct)
  
ts = ct.timestamp()
print("timestamp:-", ts)


'''
predefine the path of input and output
'''

input_file_name = 'test-output3.5.csv'
output_file_name = 'test-output3.6.csv'

'''
Initialize all day to '01'
'''
with open(str(input_file_name)) as csvfile, open(str(output_file_name), 'w') as output:
    writer = csv.writer(output, delimiter=',')
    reader = csv.reader(csvfile, delimiter=',')

    line_count = 0
    for row in reader:
        line_count += 1
        if line_count <= 1:
            '''
            Skip the first row of csv file, which is a row of title
            '''
            writer.writerow(row)
        else:
            #Starting line: 
            '''Overwrite the day from day '17' to day '01'
            '''
            time_str = row[2]
            date_str = '01'
            time_str = date_str + time_str[2:]
            row[2] = time_str
            writer.writerow(row)


'''
Overwirte the day into range from '02' to '31' and append to the output file
'''
for date in range(2,32):
   with open(str(input_file_name)) as csvfile, open(str(output_file_name), 'a') as output:
    writer = csv.writer(output, delimiter=',')
    reader = csv.reader(csvfile, delimiter=',')

    line_count = 0
    for row in reader:
        #print(len(row))
        line_count += 1
        if line_count <= 1:
            '''
            Skip the first row
            '''
            pass
        else:
            '''
            Overwirte the day into range from '02' to '31'
            '''
            time_str = row[2]
            if date <= 9:
                date_str = '0'+ str(date)
            else:
                date_str = str(date)
            
            time_str = date_str + time_str[2:]
            writer.writerow(row) 

        