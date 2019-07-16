import env
import googlemaps, requests, json, time
from datetime import datetime

apiKey = env.API_KEY

gmaps = googlemaps.Client(key=apiKey, retry_over_query_limit=False)

def getDistMatrix(origins, destinations):
    url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' +  origins + '&destinations=' + destinations
    matrix = requests.get(url + '&key=' + apiKey)
    mjson = matrix.json()
    return mjson

def getRanks(times):
    ranks = {k:(.4*(v[0]+v[1])/120 + .6*abs(v[0]-v[1])/60) for (k,v) in times.items()}
    return ranks

def main():
    ##result = gmaps.geolocate()
    ##latlong = 'point:' + str(result['location']['lat']) + ',' + str(result['location']['lng'])
    ##print(latlong)

    latlong = 'point:41.3229056,-73.0988544'
    query1 = input("Enter the first location: ") 

    res = gmaps.find_place(query1, 'textquery',
                        fields=['geometry', 'id', 'name', 'formatted_address'],
                        location_bias=latlong)

    if len(res['candidates']) == 0:
        print("Sorry, we couldn't find a match for that location...")
        return
    print(res['candidates'][0]['formatted_address'])
    geo1 = (res['candidates'][0]['geometry']['location']['lat'], res['candidates'][0]['geometry']['location']['lng'])
    
    query2 = input("Enter the second location: ")
    res = gmaps.find_place(query2, 'textquery',
                        fields=['geometry', 'id', 'name', 'formatted_address'],
                        location_bias=latlong)
    

    if len(res['candidates']) == 0:
        print("Sorry, we couldn't find a match for that location...")
        return
    print(res['candidates'][0]['formatted_address'])
    geo2 = (res['candidates'][0]['geometry']['location']['lat'], res['candidates'][0]['geometry']['location']['lng'])

    # Calculate the midpoint between the two locations
    midpt = ((geo1[0] + geo2[0])/2, (geo1[1] + geo2[1])/2)

    # Time the program
    start = datetime.now()
    
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json?"
    fullUrl = url + 'query=dinner&location=' + str(midpt[0]) + ',' + str(midpt[1]) + '&radius=16000&key=' + apiKey
    search = requests.get(fullUrl).json()
    results = search['results']

    while 'next_page_token' in search:
        time.sleep(1.7)
        newUrl = fullUrl + '&pagetoken=' + search['next_page_token']
        search = requests.get(newUrl).json()
        if search['status'] == 'OK':
            results = results + search['results']

    print(str(len(results)) + ' results')
    placeIds = [ r['place_id'] for r in results ]
    destinations = [ 'place_id:' + pId for pId in placeIds ]
    times = {}

    #print(destinations)
    originstr = str(geo1[0]) + ',' + str(geo1[1]) + '|' + str(geo2[0]) + ',' + str(geo2[1])
    sz = 25
    dstChunks = [destinations[i * sz:(i + 1) * sz] for i in range((len(destinations) + sz - 1) // sz )]
    
    for chunk in dstChunks:
        deststr = '|'.join(chunk)
        mjson = getDistMatrix(originstr, deststr)

        for i in range(len(mjson['destination_addresses'])):
            times[chunk[i][9:]] = (mjson['rows'][0]['elements'][i]['duration']['value'], mjson['rows'][1]['elements'][i]['duration']['value'])
    #print(times)
    #print(str(len(times)) + ' elements in times')
    ranks = getRanks(times)
    sortedRanks = sorted(ranks, key=ranks.get)
    for i in range(10):
        pid = sortedRanks[i]
        details = gmaps.place(pid, fields=['name', 'formatted_address'])
        print(str(i + 1) + ': ' + details['result']['name'])
        print(details['result']['formatted_address'])
        print(times[pid][0]/60)
        print(times[pid][1]/60)
        print()
        #print(pid + ': ' + str(ranks[pid]))
    
    print('Time elapsed: ' + str(datetime.now()-start))
main()
