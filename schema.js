const schema = {
    "id": {
      "type": "string",
      "unique": true
    },
    "alias": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "image_url": {
      "type": "string"
    },
    "is_closed": {
      "type": "boolean"
    },
    "url": {
      "type": "string"
    },
    "review_count": {
      "type": "number"
    },
    "categories": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "alias": {
            "type": "string"
          },
          "title": {
            "type": "string"
          }
        }
      }
    },
    "rating": {
      "type": "number"
    },
    "coordinates": {
      "type": "object",
      "properties": {
        "latitude": {
          "type": "number"
        },
        "longitude": {
          "type": "number"
        }
      }
    },
    "transactions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "price": {
      "type": "string"
    },
    "location": {
      "type": "object",
      "properties": {
        "address1": {
          "type": "string"
        },
        "address2": {
          "type": "string"
        },
        "address3": {
          "type": "string"
        },
        "city": {
          "type": "string"
        },
        "zip_code": {
          "type": "string"
        },
        "country": {
          "type": "string"
        },
        "state": {
          "type": "string"
        },
        "display_address": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "phone": {
      "type": "string"
    },
    "display_phone": {
      "type": "string"
    },
    "distance": {
      "type": "number"
    }
  }

module.exports = schema;