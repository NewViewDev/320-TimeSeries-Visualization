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

# Note that, data3.5 has datas of whole July.
input_file_name = 'dummy-data-3.5.csv'
output_file_name = 'dummy-data-3.7.csv'

'''Recording the # of date for each month in 2020'''
months = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

title = False

# initialize the month to 1
# for each month, we do a traverse 
month = 1

while month <= 12:

    with open(str(input_file_name)) as csvfile, open(str(output_file_name), 'a') as output:
        writer = csv.writer(output, delimiter=',')
        reader = csv.reader(csvfile, delimiter=',')

        line_count = 0
        for row in reader:
            line_count += 1
            #Each time iterate the file, 

            if line_count == 1 and not title:
                writer.writerow(row)
                title = True
            else:
                if month < 10:
                    monthstr = '0' + str(month)
                else:
                    monthstr = str(month)
                
                row[2] = row[2][0:5] + monthstr + row[2][7:]

                #Generate a float number in range(25.5, 35.5)
                LMP = random.uniform(25.5, 35.5)
                LMP = round(LMP, 2) #round up
                row[3] = str(LMP)
                if row[2][8:10] != 'D' and int(row[2][8:10]) <= months[month-1]:
                    writer.writerow(row)
                
                if row[2][8:10] == '01' or row[2][8:10] == str(months[month-1]):
                    print(row[2])
        
    #month add one, restart the loop
    line_count = 0
    month += 1