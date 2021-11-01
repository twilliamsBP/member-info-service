
const TRAVEL_STATUS = 'DELIVERED'
const CONTACT_EMAIL = 'support@buzzpoints.com'
const CONTACT_PHONE = '877-577-BUZZ'
const TRADEMARK = 'Buzz Points'
const AWARDED_FOR_CANCELED_REDEMPTION = 'AWARDED_FOR_CANCELED_REDEMPTION'

const fiSettingsTravelPoints = {
  POINT_TO_DOLLAR_EXPERIENCES:  `pointToDollarExperiences`,
  POINT_TO_DOLLAR_HOTEL:  `pointToDollarHotel`,
  POINT_TO_DOLLAR_VACATIONS:  `pointToDollarVacations`,
  POINT_TO_DOLLAR_CRUISES:  `pointToDollarCruises`,
  POINT_TO_DOLLAR_AIR:  `pointToDollarAir`,
  POINT_TO_DOLLAR_CAR:   `pointToDollarCar`
};

const rewardType = {
  NATIONAL: 'NATIONAL',
  CHARITY: 'CHARITY',
  MERCHANT: 'MERCHANT',
  CAPTIVE: 'CAPTIVE',
  CASHBACK: 'CASHBACK'
};

const travelTemplateNames = {
  TRAVEL_AIR: 'travel_air',
  TRAVEL_CAR: 'travel_car',
  TRAVEL_HOTEL: 'travel_hotel',
  TRAVEL_CRUISE: 'travel_cruise',
  TRAVEL_VACATION: 'travel_vacation',
  TRAVEL_AIR_CAR_HOTEL: 'travel_air_car_hotel'
};

const travelRedemptionStatus = {
  REQUESTED: 'REQUESTED',
  DELIVERED: 'DELIVERED',
  VALIDATED: 'VALIDATED',
  SHIPPED: 'SHIPPED',
  FULFILLED: 'FULFILLED'
};

const travelRewardDelivery = {
  AUTOMATIC: 'AUTOMATIC',
  MANUAL: 'MANUAL',
  ELECTRONIC: 'ELECTRONIC'
};

const sqsMessageSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    accountToken: { type: 'string' },
    amountToBeCredited: { type: 'number' },
    points: { type: 'number' },
    rewardId: { type: 'number' }
  }
}

const getMethodCashbackSchema =
{
  type: 'object',
  additionalProperties: false,
  required: [
    'fi',
    'lifeuserid'
  ],
  properties: {
    fi: { type: 'string' },
    lifeuserid: { type: 'string' }

  }
}

const paginationSetting =
{
  type: 'object',
  required: [
    'perPage',
    'page'
  ],
  additionalProperties: false,
  properties: {
    perPage: {
      type: 'number',
      default: 100
    },
    page: {
      type: 'number',
      default: 1
    }
  }
}

module.exports = {fiSettingsTravelPoints, travelTemplateNames, TRAVEL_STATUS,
  sqsMessageSchema, getMethodCashbackSchema, paginationSetting,
  rewardType, travelRedemptionStatus, travelRewardDelivery, CONTACT_EMAIL, 
  CONTACT_PHONE, TRADEMARK, AWARDED_FOR_CANCELED_REDEMPTION
}
