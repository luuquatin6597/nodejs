class Square {								
    constructor(sideLength) {								
    this.sideLength = sideLength;								
    }								
                                    
    getPerimeter() {								
    return 4 * this.sideLength;								
    }								
                                    
    getArea() {								
    return this.sideLength * this.sideLength;								
    }								
    }								
                                    
    module.exports = Square;								