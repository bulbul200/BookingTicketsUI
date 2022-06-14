<template>
    <div id="paymentcounter" class="ticket-counter" v-show="props.payment">
        <div class="close-counter">
            <button @click="closeThisCounter">close</button>
        </div>
        <div class="counter-body">
            <div class="counter-title">
                <h5>{{props.counterdata.car_data.sacco_data.name}}, {{props.counterdata.car_data.plate_name}} {{props.counterdata.car_data.plate_number}}</h5>
                <div class="departure-details">
                    <p>Departure: {{props.counterdata.date}}</p>
                </div>
            </div>
            <div class="counter-context">
                <div class="departure-information">
                    <div class="information-title">
                        <span>Departure Information</span>
                    </div>
                    <div class="information-data">
                        <div class="field">
                            <h5>Route:</h5>
                            <span>{{props.counterdata.route.departure}} to {{props.counterdata.route.destination}}</span>
                        </div>
                        <div class="field">
                            <h5>Time:</h5>
                            <span>{{props.counterdata.time}}</span>
                        </div>
                        <div class="field">
                            <h5>Seats</h5>
                            <span>{{props.counterdata.occupied_seats}}/{{props.counterdata.car_data.seats}} seats</span>
                        </div>
                    </div>
                </div>
                <div class="passenger-form">
                    <div class="passenger-form-title">
                        <h5>Book a Seat or Seats</h5>
                    </div>
                    <div class="passenger-form-fields" v-show="!showBookForm">
                        <div class="input-fields">
                            <label for="">Phone Number <span>*</span></label>
                            <div class="input-section">
                                <div class="input-box"></div>
                                <input type="text" placeholder="eg 0712345678" ref="phoneID" v-model="phoneNO">
                            </div>
                        </div>
                        <div class="input-fields">
                            <label for="">First Name (<p>optional</p>)</label>
                            <div class="input-section">
                                <div class="input-box"></div>
                                <input type="text" placeholder="your F.name" ref="nameID" v-model="fName">
                            </div>
                        </div>
                        <div class="input-fields">
                            <label for="">Seats <span>*</span></label>
                            <div class="input-section">
                                <div class="input-box"></div>
                                <input type="number" placeholder="no. of seats" ref="seatID" v-model="seats">
                            </div>
                        </div>
                        <div class="input-fields">
                            <button @click="bookSeat">Submit</button>
                        </div>
                    </div>
                    <div class="ticketform-response" v-show="showBookForm" v-for="(data, index) in submittedData" :key="index">
                        <div class="route-details">
                            <p>Route: {{props.counterdata.route.departure}} - {{props.counterdata.route.destination}}</p>
                        </div>
                        <div class="phone-details">
                            <p>Phone No: {{data.phone_number}}</p>
                        </div>
                        <div class="booked-seats">
                            <p>Seats: {{data.seats}}</p>
                        </div>
                        <div class="price-details">
                            <p>Price: {{priceFare}}</p>
                        </div>
                        <div class="payment-description">
                            <button>proceed to pay for the ticket(s) <span>-></span></button>
                        </div>
                    </div>
                    <div class="payment-section">
                        <div class="payment-title">
                            <h5>Pay for the seat you Booked</h5>
                        </div>
                        <div class="payment-context">
                            <img src="@/assets/accepted.png" alt="">
                            <div class="payment-methods">
                                <img src="@/assets/qr.png" alt="" @click="payForTicket">
                                <span>Click the Qrcode Above to process your payment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
const emits = defineEmits(['closeCounter', 'ticketBook'])

const props = defineProps(['payment', 'counterdata', 'schedule_ID']);
const showBookForm = ref(false);


const phoneNO = ref(null);
const fName = ref(null);
const seats = ref(null);

const ticketData = ref({});

// Input ID's

const phoneID = ref(null);
const nameID = ref(null);
const seatID = ref(null);

// Toggle ticket Booking

const passengerID = ref(null);
const submittedData = ref([]);
function bookSeat() {
    if (phoneNO.value === null) {
        phoneID.value.focus();
        return;
    }
    if (seats.value === null) {
        seatID.value.focus();
        return;
    }

    const formData = {
        'scheduleID': props.schedule_ID, 'phoneNO': phoneNO.value, 'seats': seats.value
    }
    if (fName.value === !null) {
        formData['name'] = fName.value;
    }
    const {pending, data: passengerData} = useLazyFetch('http://127.0.0.1:8000/api/passenger/', {
        method: 'post',
        body: formData
    });
    watch(passengerData, (newPassengerData) => {
        submittedData.value.push(passengerData.value);
        passengerID.value = passengerData.value.id;
        ticketData.value = passengerData.value;
        emits("ticketBook", ticketData.value);
        showBookForm.value = true;
    })
}

const priceFare = computed(() => {
    return props.counterdata.price * seats.value;
})

function payForTicket() {
    console.log(ticketData['id']);
    const formData = {
        'fare': priceFare.value,
        'phone_data': phoneNO.value,
        'passengerID': passengerID.value
    }
    const {pending, data: paymentResponse} = useLazyFetch('http://127.0.0.1:8000/api/passenger/', {
        method: 'post',
        body: formData
    })
    watch(paymentResponse, (newPaymentResponse) => {
        console.log(paymentResponse.value);
    })
}
function closeThisCounter() {
    emits('closeCounter');
    showBookForm.value = false;
    submittedData.value = [];
}
</script>

<style lang="scss" scoped>
.ticket-counter {
    position: fixed;
    width: 900px;
    height: 92%;
    z-index: 999;
    bottom: 0;
    right: 0%;
    background-color: rgba(0, 0, 0, 0.2);

    .close-counter {
        position: absolute;
        top: 1.2rem;
        left: 0.2rem;
        button {
            height: 2rem;
            padding: 10px 10px;
            border: 1px solid #f94144;
            font-size: 14px;
            font-family: Roboto;
            display: flex;
            align-items: center;
            background: #ffffff;
            border-radius: 4px;
            cursor: pointer;

        }
    }
    .counter-body {
        position: absolute;
        right: 0;
        margin-top: 4rem;
        width: 100%;
        height: 82%;
        border-radius: 8px 0 0 8px;
        background: rgba(255,255,255,.91);

        .counter-title {
            padding: 4px 8px;
            width: 100%;
            height: 10%;
            background: inherit;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            gap: 0.4rem;
            color: #355070;

            h5 {
                font-family: Georgia, serif;
                font-size: 18px;
                font-weight: 900;
                background: inherit;
            }
            .departure-details {
                margin: 0 10px;
                font-size: 14px;
                font-style: oblique;
                background: inherit;

                p {
                    background: inherit;
                }
            }
        }
        .counter-context {
            margin: 2px;
            padding: 8px;
            width: 100%;
            height: 90%;
            background: inherit;

            .departure-information {
                width: 60%;
                height: 8rem;
                border: 1px solid #c0c0c0;
                border-radius: 4px;
                display: flex;
                flex-direction: column;

                .information-title {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 40%;
                    background: #e9ecef;
                    border-bottom: 1px solid #c0c0c0;

                    span {
                        margin: 0 1rem;
                        background: inherit;
                        font-size: 18px;
                        font-weight: 600;
                        font-style: oblique;
                        color: #003049;
                    }
                }
                .information-data {
                    display: flex;
                    flex-direction: row;
                    gap: 0.5rem;
                    height: 60%;
                    background: inherit;

                    .field {
                        padding: 0 4px;
                        width: 33%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;

                        h5 {
                            height: 50%;
                            display: flex;
                            align-items: center;
                            font-size: 14px;
                            font-weight: 800;
                            font-style: oblique;
                            color: #003049;
                            letter-spacing: 1px;
                        }
                        span {
                            height: 50%;
                            display: flex;
                            align-items: center;
                            font-size: 15px;
                            color: #4a5759;
                            font-family: "Gill Sans", sans-serif;
                        }
                    }

                }
            }
            .passenger-form {
                margin-top: 1.3rem;
                padding: 4px 8px;
                width: 100%;
                min-height: 12rem;
                background: inherit;
                display: flex;
                flex-wrap: wrap;

                .passenger-form-title {
                    width: 100%;
                    height: 1.2rem;
                    display: flex;
                    align-items: center;
                    background: inherit;

                    h5 {
                        font-size: 16px;
                        font-style: oblique;
                        color: #003049;
                        font-weight: 900;
                        background: inherit;
                    }
                }
                .passenger-form-fields {
                    width: 55%;
                    margin-top: 1rem;
                    padding: 0 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    background: inherit;
                    .input-fields {
                        width: 100%;
                        height: 4rem;
                        display: flex;
                        flex-direction: column;
                        background: inherit;
                        label {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            margin-left: 6px;
                            font-size: 13px;
                            height: 50%;
                            color: #003049;
                            font-weight: 700;
                            font-style: oblique;
                            background: inherit;

                            span {
                                color: #f94144;
                                font-size: 16px;
                            }
                            p {
                                font-size: 12px;
                            }
                        }
                        .input-section {
                            width: 100%;
                            height: 50%;
                            position: relative;
                            background: inherit;

                            .input-box {
                                position: absolute;
                                left: 0;
                                top: 0%;
                                height: 100%;
                                width: 28px;
                                background: #abc;
                                border-radius: 4px 0 0 4px;
                                border-left: 1px solid #c0c0c0;
                            }
                            input {
                                padding: 0 36px;
                                width: 50%;
                                height: 100%;
                                border: 1px solid #c0c0c0;
                                outline: none;
                                border-radius: 4px;
                                color: #003049;
                                letter-spacing: 1px;
                            }

                        }
                        button {
                            width: 50%;
                            height: 2.4rem;
                            border-radius: 6px;
                            border: 1px solid #0496ff;
                            color: #0496ff;
                            font-size: 16px;
                            font-weight: 800;
                            font-family: Roboto;
                            cursor: pointer;
                            transition: color 300ms ease,
                                box-shadow 300ms ease;

                            &:hover {
                                color: #2b9348;
                                box-shadow: #2b9348 0px 0px 0px 2px;
                            }
                        }
                    }
                }
                .payment-section {
                    padding: 8px;
                    width: 40%;
                    min-height: 6rem;
                    background: inherit;
                    border: 1px solid #c0c0c0;
                    border-radius: 4px;

                    .payment-title {
                        width: 100%;
                        height: 1.8rem;
                        padding: 0 8px;
                        display: flex;
                        align-items: center;
                        color: #003049;
                        background: inherit;
                        border-bottom: 1px solid #c0c0c0;

                        h5 {
                            font-size: 16px;
                            font-family: Roboto;
                            font-style: oblique;
                            background: inherit;
                        }
                    }
                    .payment-context {
                        margin-top: 0.4rem;
                        width: 100%;
                        background: inherit;

                        img {
                            background: inherit;
                            height: 2rem;
                            width: 50%;
                            object-fit: cover;
                            // display: flex;

                        }
                        .payment-methods {
                            width: 100%;
                            background: inherit;
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;
                            flex-direction: column;
                            img {
                                margin-left: 1rem;
                                width: 12rem;
                                height: 12rem;
                                cursor: pointer;
                                transition: transform 300ms ease;

                                &:hover {
                                    transform: scale(1.02);
                                }
                            }
                            span {
                                font-size: 14px;
                                color: #003049;
                                font-family: Roboto;
                                background: inherit;
                            }
                        }
                    }
                }

            }
        }
    }
}

.ticketform-response {
    margin-top: 1rem;
    padding: 8px;
    width: 55%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background: inherit;
    p {
        font-family: Roboto;
        font-size: 18px;
        letter-spacing: 1px;
        background: inherit;
    }
    .route-details, .phone-details, .booked-seats, .price-details, .payment-description {
        background: inherit;
        width: 60%;
        height: 2rem;
        display: flex;
        align-items: center;
    }
    button {
        width: 100%;
        height: 100%;
        border: 1px solid #c0c0c0;
        border-radius: 4px;
        font-size: 18px;
        font-family: Roboto;
        cursor: pointer;
        color: #003049;
        span {
            font-size: 14px;
            margin-left: 1rem;
        }

        &:hover {
            border: 2px solid #2b9348;
        }
    }
}
</style>