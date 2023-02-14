const Allflights = await(fetch("https://opensky-network.org/api/states/all").then((res) => res.json()).catch((err) => console.log(err)));

const flights = []

for(let i = 0; i < 20; i++)
{
    flights.push(Allflights.states[i]);
}

console.log(flights);