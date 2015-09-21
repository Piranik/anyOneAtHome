# anyOneAtHome
This is a sample app that determines if anyone is present in a wifi network

The entire setup is segregated in to 2 parts
i) client: A scapy program that detects arp packets in the network and updates the remote app.
ii) App : A node js app that listens to client request mainly
          a) scapy client request
          b) user request for display


SCHEMA OF REMOTE DB:

create table userInfo (
        mac varchar(30) primary key,
        name varchar(50),
        alias varchar(30);
        deviceType varchar(20),
        lastseen timestamp
);
