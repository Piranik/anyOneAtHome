# anyOneAtHome
Detects presence of devices in a wifi network



create table userInfo (
        mac varchar(30) primary key,
        name varchar(50),
        alias varchar(30);
        deviceType varchar(20),
        lastseen timestamp
);
 create index mac_index on userinfo (mac);
 insert into userinfo(name,devicetype,mac,lastseen) values('lol','iphone','MMM',transaction_timestamp());
