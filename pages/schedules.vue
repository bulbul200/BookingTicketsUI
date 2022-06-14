<template>
    <main>
        <div class="container">
            <header>
                <h3>Create Travel Schedule</h3>
            </header>
            <hr>
            <section>
                <div class="input-fields">
                    <label>Vehicle</label>
                    <input v-model="vehicles" ref="vehicleID" type="text" placeholder="enter vehicle plate number ..." @input="searchCar" @keydown.enter="findCar">
                    <div class="cars" v-show="carsModal">
                        <div class="cars-selection" v-for="(car, index) in cars" :key="index">
                            <p @click="chooseCar(index)">{{car.plate_name}} {{car.plate_number}} </p>
                        </div>
                    </div>
                </div>
                <div class="input-fields">
                    <label>Date</label>
                    <input type="date" placeholder="date of departure ..." v-model="date" ref="dateID">
                </div>
                <div class="input-fields">
                    <label>Time</label>
                    <input type="time" placeholder="time of departure ..." v-model="time" ref="timeID">
                </div>
                <div class="input-fields">
                    <label>Price</label>
                    <input type="number" placeholder="enter travel fare ..." v-model="price" ref="priceID">
                </div>
                <div class="places-section">
                    <div class="input-group">
                        <label>Route:</label>
                        <input type="text" placeholder="enter travel route ..." v-model="destinations" @input="findDeparture" ref="destinationID">
                        <div class="place-selection" v-show="routesModal">
                            <div class="places" v-for="(route, index) in routes" :key="index">
                                <p @click="chooseRoute(index)">{{route.departure}} - {{route.destination}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="submit-field">
                    <button @click="createSchedule">Create</button>
                </div>
            </section>
        </div>
    </main>
</template>

<script setup>

const cars = ref([]);
const vehicles = ref('');
const carsModal = ref(false);
const destinations = ref('');
const routes = ref([]);
const routesModal = ref(false);


const price = ref(null);
const time = ref(null);
const date = ref(null);
const vehiclesData = ref(null);
const routeData = ref(null);


function searchCar() {
    if (vehicles.value === '') {
        carsModal.value = false;
        return;
    }
    carsModal.value = true;
    const formData = {
        'car': vehicles.value
    }
    const {pending, data: found, refresh} = useLazyFetch('http://127.0.0.1:8000/api/car/', {
        method: 'post',
        body: formData
    })
    watch(found, (newFound) => {
        cars.value = [];
        var arrayLength = found.value
        for (var i = 0; i < arrayLength.length; i++) {
            cars.value.push(found.value[i]);
        }
    })
}
function findCar() {
    if (vehicles.value === '') {
        carsModal.value = false;
        return;
    }
    carsModal.value = true;
    const formData = {
        'car': vehicles.value
    }
    const {pending, data: found, refresh} = useLazyFetch('http://127.0.0.1:8000/api/car/', {
        method: 'post',
        body: formData
    })
    watch(found, (newFound) => {
        cars.value = [];
        var arrayLength = found.value
        for (var i = 0; i < arrayLength.length; i++) {
            cars.value.push(found.value[i]);
        }
    })
}

function chooseCar(index) {
    const chosen = cars.value[index];
    vehicles.value = chosen.plate_name + ' ' + chosen.plate_number;
    carsModal.value = false;
    vehiclesData.value = chosen.id;
}

function findDeparture() {
    if (destinations.value === '') {
        routesModal.value = false;
        return;
    }
    const {pending, data: found} = useLazyFetch(`http://127.0.0.1:8000/api/routes/?place=${destinations.value}`)

    watch(found, (newFound) => {
        routesModal.value = true;
        routes.value = [];
        var arrayLength = found.value;
        for (var i = 0; i < arrayLength.length; i++) {
            routes.value.push(found.value[i]);
        }
    })
}

function chooseRoute(index) {
    destinations.value = routes.value[index].departure + ' - ' + routes.value[index].destination;
    routesModal.value = false;
    routeData.value = routes.value[index].id;
    console.log(routeData.value);
}

// DOM id's
const vehicleID = ref(null);
const dateID = ref(null);
const timeID = ref(null);
const priceID = ref(null);
const destinationID = ref(null);

// Created Response
const scheduleResponse = ref([]);
const router = useRouter();
function createSchedule() {
    if (vehiclesData.value === null) {
        vehicleID.value.focus();
        return;
    }
    if (date.value === null) {
        dateID.value.focus();
        return;
    }
    if (time.value === null) {
        timeID.value.focus();
        return;
    }
    if (price.value === null) {
        priceID.value.focus();
        return;
    }
    if (routeData === null) {
        destinationID.value.focus();
        return;
    }
    const formData = {
        'carID': vehiclesData.value, 'routeID': routeData.value,
        'date': date.value, 'time': time.value, 'price': price.value
    }
    const {pending, data: postResponse} = useLazyFetch('http://127.0.0.1:8000/api/schedules/', {
        method: 'post',
        body: formData
    })
    watch(postResponse, (newPostResponse) => {
        console.log(postResponse.value);
        scheduleResponse.value.push(postResponse.value);
        router.push("/");
    })
}
</script>

<style lang="scss" scoped>

main {
    width: 100%;
    background: inherit;
    display: flex;
    justify-content: center;

    .container {
        width: 60%;
        min-height: 40vh;
        background: #ffffff;
        border-radius: 8px;
        padding: 10px;

        header {
            width: 100%;
            height: 3rem;
            display: flex;
            align-items: center;
            background: inherit;

            h3 {
                background: inherit;
                margin-left: 2rem;
                font-family: Roboto;
                font-size: 24px;
                font-style: oblique;
                color: #023047;
            }
        }
    }
}
hr {
    border: 0;
    height: 2px;
    background: #333;
    background-image: linear-gradient(to right, #ccc, #333, #ccc);
}

section {
    margin-top: 2rem;
    width: 100%;
    background: inherit;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
    .input-fields {
        position: relative;
        padding: 6px;
        width: 40%;
        height: 6rem;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        gap: 0.5rem;
        // align-items: center;
        background: inherit;

        label {
            margin-left: 1rem;
            height: 40%;
            width: 100%;
            padding: 0 10px;
            // font-size: 18px;
            display: flex;
            align-items: center;
            background: inherit;
        }
        input {

            padding: 0 10px;
            width: 70%;
            height: 50%;
            border: 1px solid #c0c0c0;
            outline: none;
            border-radius: 4px;
            color: #023047;
            font-size: 14px;
            font-style: oblique;
            background: inherit;

            &:focus {
                border: 1px solid #3fa34d;
            }
        }
    }
}
label {
    font-style: oblique;
    color: #023047;
}
.cars {
    position: absolute;
    padding: 4px;
    z-index: 20;
    bottom: 0%;
    left: 0%;
    width: 55%;
    min-height: 5rem;
    max-height: 8rem;
    overflow-y: auto;
    border-radius: 6px;
    transform: translate(3%, 100%);
    background: #eff1f3;
    .cars-selection {
        width: 100%;
        padding: 2px 4px;

        p {
            width: 100%;
            height: 2rem;
            background: #ffffff;
            display: flex;
            align-items: center;
            padding-left: 6px;
            border-radius: 2px;
            border: 1px solid #c0c0c0;
            font-size: 14px;
            color: #023047;
            font-weight: 700;
            letter-spacing: 1px;
            cursor: pointer;
            transition: transform 300ms ease;
            &:hover {
                transform: scale(1.03);
            }
        }
    }
}
.submit-field {
    margin-top: 2rem;
    width: 100%;
    height: 3rem;
    background: inherit;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
        background: inherit;
        border: 1px solid #4cc9f0;
        border-radius: 6px;
        width: 50%;
        height: 100%;
        color: #1982c4;
        // font-family: Roboto;
        font-size: 18px;
        font-weight: 900;
        font-style: oblique;
        cursor: pointer;
        transition: color 300ms ease, transform 300ms ease;

        &:hover {
            transform: scale(1.05);
            color: #3fa34d;
            border: 2px solid #3fa34d;
        }
    }
}
.places-section {
    width: 100%;
    height: 5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: inherit;

    .input-group {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 40%;
        height: 100%;
        gap: 0.5rem;
        background: inherit;

        label {
            margin-left: 0.8rem;
            width: 100%;
            height: 40%;
            display: flex;
            align-items: center;
            background: inherit;
        }
        input {
            padding: 0 8px;
            width: 70%;
            height: 50%;
            outline: none;
            border: 1px solid #c0c0c0;
            border-radius: 4px;
            display: flex;
            justify-content: flex-start;
            background: inherit;
            color: #023047;
            font-size: 14px;
            font-style: oblique;
            letter-spacing: 1px;
            transition: border 300ms ease;
            &:focus {
                border: 1px solid #3fa34d;
            }
        }
        .place-selection {
            position: absolute;
            bottom: 0%;
            left: 0%;
            padding: 6px;
            width: 45%;
            min-height: 5rem;
            max-height: 8rem;
            overflow-y: auto;
            border-radius: 4px;
            transform: translate(3%, 100%);
            display: flex;
            flex-direction: column;
            gap: 0.1rem;

            .places {
                width: 100%;
                display: flex;

                p {
                    padding: 0 4px;
                    width: 100%;
                    height: 1.8rem;
                    display: flex;
                    align-items: center;
                    background: #ffffff;
                    border: 1px solid #c0c0c0;
                    border-radius: 2px;
                    color: #023047;
                    font-family: Roboto;
                    font-size: 16px;
                    cursor: pointer;
                    transition: transform 300ms ease;
                    &:hover {
                        transform: scaleX(1.04);
                    }
                }
            }
        }
    }
}

</style>