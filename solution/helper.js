// full disclosure: I found and adapted this binaryInsertion funtion via a quick Google search
// this cuts down the time to insert an element into our sorted array to O(logn) 
const binaryInsertion = (arr, element) => {
    return binaryHelper(arr, element, 0, arr.length - 1);
}

const binaryHelper = (arr, element, lBound, uBound) => {
    if (!arr.length) {
        arr = [element];
        return;
    }
    if (arr.length === 1) {
        if (element.last.date < arr[0].last.date) {
            arr.splice(0, 0, element);
        } else {
            arr.push(element);
        }
        return;
    }
    if (uBound - lBound === 1) {
        // binary search ends, we need to insert the element around here       
        if (element.last.date < arr[lBound].last.date) arr.splice(lBound, 0, element);
        else if (element.last.date > arr[uBound].last.date) arr.splice(uBound+1, 0, element);
        else arr.splice(uBound, 0, element);
    } else {       
        // we look for the middle point
        const midPoint = Math.floor((uBound - lBound) / 2) + lBound;
        // depending on the value in the middle, we repeat the operation only on one slice of the array, halving it each time
        element.last.date < arr[midPoint].last.date
            ? binaryHelper(arr, element, lBound, midPoint)
            : binaryHelper(arr, element, midPoint, uBound);
    }
}

module.exports = {binaryInsertion}