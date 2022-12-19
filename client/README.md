Features
For our minimum viable product, we have integrated the following features
- Use Case 1 (Sanity Check)
Given a base case and scenario for a Pnode, the application produces a scatter plot, histogram, and heatmap, each with the option to aggregate by yearly, quarterly, monthly, daily, and hourly intervals. The user also has the option to select a date range. 

- Use Case 2 (Analysis)
Given a scenario, a date range, and either the option to group by a Pnode or a generator type, the application produces a statistics table of mean, median, and standard deviation values. The user can aggregate by yearly, monthly, daily, or all. If a Pnode is chosen, data is displayed for the selected Pnode and if a generator field is selected, data is displayed for each entry in the selected generator field. 

For both use cases, aggregation and the selected date range use local time. When aggregating, the interval of time for each aggregation will be defined in local time. When selecting a date range, entries in the database will only return if they fall within the span of time defined by the selected date range according to local time.
