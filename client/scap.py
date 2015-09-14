#!/usr/bin/python
#####! /usr/bin/env python
from scapy.all import *
import time
import urllib
import urllib2

onlineDevices = {}

def arp_monitor_callback(pkt):
   
    if ARP in pkt and pkt[ARP].op in (1,2): #who-has or is-ati
	 currentDeviceMAC = pkt[ARP].hwsrc
	 ts = time.time()
	 if currentDeviceMAC not in onlineDevices.keys():
		print "Adding device "+str(pkt[ARP].hwsrc)
		onlineDevices[currentDeviceMAC] = ts
		data = urllib.urlencode({'mac': currentDeviceMAC})
		##headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
	 elif onlineDevices[currentDeviceMAC]+60 < ts :
		print "Updating device "+str(pkt[ARP].hwsrc)
		onlineDevices[currentDeviceMAC] = ts
			
	 data = urllib.urlencode({'mac': currentDeviceMAC})
	 req = urllib2.Request("https://anyoneathome.herokuapp.com/update", data)
	 response = urllib2.urlopen(req)
	 result = response.read()
	 print result
	 #return pkt.sprintf("%ARP.hwsrc% %ARP.psrc% %ARP.show()%"+str(ts))

sniff(prn=arp_monitor_callback, filter="arp", store=0)
