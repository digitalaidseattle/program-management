
ALTER TABLE 
    venture_report
ADD 
    column reporting_date date NOT NULL default now();
