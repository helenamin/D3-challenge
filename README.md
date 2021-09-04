# Data Journalism and D3



## Table of Contents

- [Background](#Background)
- [Structure](#Structure)
- [Description](#Description)
- [Deployed Site](#Deployed_Site)
- [Datasets](#Datasets)
- [Technology](#Technology)
- [Contributors](#Contributors)

## Background

This challenge is about analyzing the current trends shaping people's lives by creating charts, graphs, and interactive elements to help readers understand the findings.

It contains a series of feature stories about the health risks facing particular demographics. The information is from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.

The data set is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml), it includes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."

## Structure
```
 
Health-Risk-Analysis
|
|__ D3_data_journalism/                            # contains ETL and ML notebooks
|     |__ Images                                   # images used in project
|     |__ assets
|         |__static/                                    
|            |__ css                               # css files for webpage
|            |__ data                              # Directory for the data files                        
|            |__ js                                # js files for webpage
|
|__index.html                               
|__ .gitignore  
|__ README.md                               # read me file

                   
```

## Description

The scatter plot in the page has been created using D3 techniques. It represents each state with circle elements and includes state abbreviations in the circles.

There are six labels in the scatter plot which gives the user capability of interacting with data by click on them. So users can decide which data to display. Both the transitions for the circles' locations as well as the range of the axes are animated. There are three risk factors for each axis.

The chart also contains tooltips to reveal a specific element's data when the user hovers their cursor over the element. 

## Deployed Site

Visit the page: https://helenamin.github.io/D3-challenge/

Here is how it finally looks like:

![D3 challenge Gif](/D3_data_journalism/Images/D3.gif)

## Datasets
| # | Source | Link |
|-|-|-|
| 1 | United States Census Bureau | [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml) |

## Technology

![PythonLogo](/D3_data_journalism/Images/tools.png)


## Contributors

- [Helen Amin](https://github.com/helenamin)