# hospitals = ['Bellevue Multispeciality Hospital', 'Siddhi Vinayak Hospital', 'Saroogi Hospital']
hospitals = [{
    'name': 'Bellevue Multispeciality Hospital',
    'ambulances': 4,
}, {
    'name': 'Siddhi Vinayak Hospital',
    'ambulances': 2,
}, {
    'name': 'Saroogi Hospital',
    'ambulances': 3,
}]

def get_hospital(severity):
    if severity > 0.5:
        return hospitals[0]['name']
    else:
        for i in hospitals:
            if i['ambulances'] > 3:
                return i['name']

# get_hospital()