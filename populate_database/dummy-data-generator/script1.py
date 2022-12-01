from asyncore import write
import csv
from decimal import Decimal
import random
# using datetime module
import datetime
import time
  
# ct stores current time
ct = datetime.datetime.now()
print("current time:-", ct)
  
# ts store timestamp of current time
ts = ct.timestamp()
print("timestamp:-", ts)



input_file_name = 'test-output3.5.csv'
output_file_name = 'test-output3.6.csv'

'''
Overwrite the PERIOD_ID from the current_format to goal_format 
'''
current_format = '%d-%m-%Y %H'
goal_format = '%Y-%m-%dT%H:%M:%S'

with open(str(input_file_name)) as csvfile, open(str(output_file_name), 'w') as output:
    writer = csv.writer(output, delimiter=',')
    reader = csv.reader(csvfile, delimiter=',')

    line_count = 0
    for row in reader:
        #print(len(row))
        line_count += 1

        if line_count == 1:
            writer.writerow(row)
        else:
            #Starting line: 

            string = row[2]
            timestamp = time.mktime(datetime.datetime.strptime(string,current_format).timetuple())

            timestamp_obj = datetime.datetime.fromtimestamp(float(timestamp))
            formated = timestamp_obj.strftime(goal_format)

            row[2] = formated

            writer.writerow(row)