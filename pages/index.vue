<template>
    <div id="home">
        <div class="right-section">
            <div class="search-bar">
                <div class="about">
                    where would you like to travel to ...
                </div>
                <div class="fields">
                    <div class="searchfield">
                        <h5>From</h5>
                        <input type="text" placeholder="eg Nakuru">
                    </div>
                    <div class="searchfield">
                        <h5>to</h5>
                        <input type="text">
                    </div>
                    <div class="searchfield">
                        <h5>date</h5>
                        <input type="date" id="">
                    </div>
                    <div class="searchfield">
                        <button>Search</button>
                    </div>
                </div>
            </div>
            <div class="page-title">
                <h3>Scheduled departures for today...</h3>
            </div>
            <div class="page-context">
                <div class="schedules-section"
                    v-for="(lineup, index) in schedules" :key="index"
                >
                    <div class="icons-right">
                        <img src="@/assets/images.jpeg" alt="">
                    </div>
                    <div class="schedules-description">
                        <div class="car-name">
                            <div class="car-details">
                                <h5>{{lineup.car_data.sacco_data.name}}</h5>
                                <p>Departure: {{lineup.date}}</p>
                            </div>
                            <div class="ticket">
                                <button @click="openCounter(lineup.id)">Book Ticket</button>
                            </div>
                        </div>
                        <div class="car-description">
                            <div class="routes">
                                <h5>Route:</h5>
                                <p>{{lineup.route.departure}} to {{lineup.route.destination}}</p>
                            </div>
                            <div class="departure-time">
                                <h5>Time:</h5>
                                <p>{{lineup.time}}</p>
                            </div>
                            <div class="seats">
                                <h5>Availability:</h5>
                                <p>{{lineup.occupied_seats}}/{{lineup.car_data.seats}}seats</p>
                            </div>
                            <div class="travel-fare">
                                <h5>Fare:</h5>
                                <p>Ksh. {{lineup.price}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="left-section">
            <div class="title-status">
                <h5>Tickets Status</h5>
            </div>
            <div class="status-body">
                <div class="status-search-bar">
                    <input type="text" placeholder="eg 0712345678">
                    <button>Refresh</button>
                </div>
            </div>
            <div class="bought-tickets">
                <div class="ticket-group" v-for="(ticket, index) in tickets" :key="index">
                    <img src="@/assets/qr.png" alt="">
                    <div class="ticket-description">
                        <span>Phone Number:</span>
                        <p>{{ticket.phone_number}}</p>
                    </div>
                    <div class="ticket-description">
                        <span>Schedule Number:</span>
                        <p>{{ticket.schedules}}</p>
                    </div>
                    <div class="ticket-description">
                        <span>Seats:</span>
                        <p>{{ticket.seats}}</p>
                    </div>
                </div>
            </div>
        </div>
        <transition name="slide-counter">
            <ticket-booking :payment="payment" :counterdata="ticketdata" :schedule_ID="schedule_ID" @close-counter="closeCounter" @ticketBook="ticketBook"></ticket-booking>
        </transition>
    </div>
</template>

<script setup>
import { useAuth } from "~~/store/Auth";
const lineups = ref([]);
const payment = ref(false);
const ticketdata = ref({
    "id": 0,
    "car_data": {
        "id": 0,
        "sacco_data": {
            "id": 0,
            "name": ""
        },
        "plate_name": "",
        "plate_number": "",
        "seats": 0
    },
    "route": {
        "id": 0,
        "departure": "",
        "destination": ""
    },
    "date": "",
    "time": "",
    "price": "",
    "full": false,
    "occupied_seats": 0
})
const store = useAuth();

const schedule_ID = ref(null);
function openCounter(id) {
    payment.value = true;
    schedule_ID.value = id;
    const {pending, data: schedule } = useLazyFetch(`http://127.0.0.1:8000/api/schedules/?scheduleid=${id}`)
    watch(schedule, (newSchedule) => {
        ticketdata.value = schedule.value;
        console.log(ticketdata.value);
    })
}
function closeCounter() {
    payment.value = false;
}
const tickets = ref([]);
function ticketBook($event) {
    console.log("event data passed");
    tickets.value.push($event);
    console.log($event);
}
function start(el) {el.style.width = el.width + 'px'}
function end(el) {el.style.width = ""}

const { pending, data: schedules } = useLazyAsyncData('schedules', () => $fetch('http://127.0.0.1:8000/api/schedules/'));

watch(schedules, (newSchedules) => {
    lineups.value = schedules;
    console.log(lineups);
})

</script>


<style scoped lang="scss">


.slide-counter-enter-from, .slide-counter-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.slide-counter-enter-active, .slide-counter-leave-active {
  transition: opacity 500ms ease, transform 400ms ease;
}
#home {
    width: 100%;
    height: 100%;
    background: inherit;
    overflow: hidden;
    display: flex;
    justify-content: flex-end;
    gap: 4rem;
}
.right-section {
    width: 60%;
    min-height: 60vh;
    background: #ffffff;
    border-radius: 4px;
    padding: 10px;
    display: flex;
    flex-direction: column;
}
.left-section {
    margin-right: 1rem;
    padding: 8px;
    width: 23%;
    height: 40vh;
    border-radius: 4px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .title-status {
        position: relative;
        width: 100%;
        height: 2rem;
        display: flex;
        align-items: center;
        background: inherit;

        &::after {
            position: absolute;
            content: '';
            width: 100%;
            height: 1px;
            background: #c0c0c0;
            bottom: 0%;

        }
        h5 {
            margin: 0 9px;
            font-size: 18px;
            font-family: Roboto;
            color: #1982c4;
            background: inherit;
        }
    }
    .status-body {
        width: 100%;
        display: flex;
        flex-direction: column;
        background: inherit;

        .status-search-bar {
            width: 100%;
            height: 2rem;
            padding: 0 8px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            background: inherit;
            border-radius: 4px;

            input {
                width: 55%;
                height: 90%;
                border: 1px solid #c0c0c0;
                border-radius: 4px;
                outline: none;
                padding: 0 8px;
                font-size: 13px;
                font-style: oblique;
                letter-spacing: 0.2px;
                background: inherit;

                &:focus {
                    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
                }
            }
            button {
                height: 90%;
                padding: 0 10px;
                border: 1px solid #2b9348;
                outline: none;
                border-radius: 4px;
                color: #003049;
                font-weight: 600;
                letter-spacing: 1px;
                cursor: pointer;
                background: inherit;
                transition: color 300ms ease;

                &:hover {
                    color: #2b9348;
                }
            }
        }
    }
    .bought-tickets {
        width: 100%;
        padding: 2px;
        min-height: 4rem;
        border-radius: 4px;
        // background: inherit;
        .ticket-group {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 1.5rem;
            width: 100%;
            padding: 4px;
            background: #ffff;
            min-height: 1.5rem;
            border-radius: 4px;
            img {
                width: 3.5rem;
                height: 3.5rem;
                object-fit: cover;
            }
            .ticket-description {
                background: inherit;
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 100%;
                gap: 0.8rem;
                span {
                    color: #003049;
                    font-family: Roboto;
                    font-size: 14px;
                    background: inherit;
                }
                p {
                    font-size: 12px;
                    color: #003049;
                    background: inherit;
                }
            }
        }
    }
}
.right-section .search-bar {
    // padding: 6px 20px;
    width: 100%;
    height: 8rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0.4rem;

    .about {
        height: 22%;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 20px;
        color: #003049;
        font-style: oblique;
        font-weight: 100;
    }
    .fields {
        width: 100%;
        height: 78%;
        display: flex;
        align-items: center;
        gap: 1.4rem;
        padding: 6px 20px;

        .searchfield {
            width: 28%;
            height: 80%;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            gap: 1rem;

            h5 {
                font-style: oblique;
            }
            input {
                width: 90%;
                outline: none;
                height: 80%;
                padding: 0 12px;
                border-radius: 4px;
                border: 1px solid #c0c0c0;
                font-size: 17px;
                letter-spacing: 0.8px;
                color: #003049;
                font-family: ubuntu;
                transition: box-shadow 300ms ease;

                &:focus {
                    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
                }
            }
            &:last-child {
                padding: 4px 0;
                width: 16%;
                height: 80%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;

                button {
                    position: absolute;
                    bottom: 0%;
                    left: 1%;
                    width: 100%;
                    height: 60%;
                    border-radius: 6px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #0b3954;
                    border: 1px solid #2b9348;
                    cursor: pointer;
                    transition: color 300ms ease;

                    &:hover {
                        color: #2b9348;
                    }

                }
            }
        }
    }
    
}
.right-section .page-title {
    width: 100%;
    margin: 1rem 0;
    padding: 0 30px;
    height: 2.5rem;
    display: flex;
    align-items: center;
    color: #424b54;
    font-size: 15px;
    font-weight: 300;
    font-style: oblique;
}
.page-context {
    // margin-top: 0.5rem;
    width: 100%;
    padding: 0 5px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: inherit;
}
.page-context .schedules-section {
    width: 100%;
    height: 8rem;
    display: flex;
    flex-direction: row;
    border-radius: 2px;
}
.page-context .schedules-section .icons-right {
    width: 25%;
    height: 100%;
    padding: 4px;
    border-right: 1px dashed #c0c0c0;
}
.page-context .schedules-description {
    width: 72%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 8px;
}
.page-context .schedules-description .car-name {
    width: 100%;
    height: 40%;
    border-bottom: 1px solid #c0c0c0;
    font-size: 12px;
    color: #0b3954;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .ticket {
        height: 100%;
        width: 20%;
        display: flex;
        align-items: center;
        justify-content: center;

        button {
            border: 1px solid #0496ff;
            padding: 8px;
            border-radius: 4px;
            color: #0496ff;
            font-weight: 600;
            font-family: Roboto;
            cursor: pointer;

            transition: box-shadow 300ms ease;

            &:hover {
                box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
            }
        }
    }
}
.page-context .schedules-description .car-name h5 {
    font-size: 16px;
    font-style: oblique;
    margin: 0.2rem 0.1rem;
    font-weight: 800;
}
.page-context .schedules-description .car-name p {
    margin: 0.3rem;
}
.page-context .schedules-section .schedules-description .car-description {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;
    height: 100%;
}
.page-context .schedules-section .icons-right img {
    width: 90%;
    height: 90%;
    object-fit: cover;
    border-radius: 3px;
}
.page-context .schedules-section .schedules-description .car-description .routes {
    width: 25%;
    height: 100%;
}
.page-context .schedules-section .schedules-description .car-description .departure-time {
    width: 25%;
    height: 100%;
}
.page-context .schedules-section .schedules-description .car-description .seats {
    width: 25%;
    height: 100%;
}
.page-context .schedules-section .schedules-description .car-description .travel-fare {
    width: 25%;
    height: 100%;
}
.page-context .schedules-section .schedules-description .car-description h5 {
    height: 40%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-style: oblique;
    color: #0b3954;
}
.page-context .schedules-section .schedules-description .car-description p {
    height: 60%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13.5px;
    color: #0b3954;
}

</style>