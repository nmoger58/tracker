const socket=io();

// console.log("hey")

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
    (position)=>{
       const {latitude,longitude}= position.coords;
       socket.emit('send-location',{latitude,longitude})
    },
    (err)=>{
        console.error(err)
    },
    {
        enableHighAccuracy :true,
        maximumAge : 0,//not to depend on old data use new data as soon as available
        timeout : 5000, // after every 5 secs location is got
    })
}

const map= L.map("map").setView([0,0],16)


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution :  "Striker Master Ice"
}).addTo(map)

const markers={};

socket.on('recieve-location',(data)=>{
    const {id,latitude,longitude}=data;
    map.setView([latitude,longitude],16);// 20 is the zoom rate
    if (markers[id]) {
        markers[id].setLatLng([latitude,longitude])
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map)
    }
})

socket.on('user-disconnected',(id)=>{
if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id]
}
})
