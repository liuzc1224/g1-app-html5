export const Move = {
    moveFixTime: function (ele, start, end, attr, allTime, fn) {
        let frequency = 1000 / 60;
        let stepNum = allTime / frequency;
        let step = (end - start) / stepNum;
        let count = 0;
        let time = setInterval(function () {
            count++;
            start += step;
            if (count >= stepNum) {
                start = end;
                clearInterval(time);
                if (fn) {
                    fn(ele, start);
                }
            }
            if (attr != "opacity") {
                ele.style[attr] = start + "px";
            } else {
                ele.style.opacity = start;
                ele.style.filter = "alpha(opacity=" + start * 100 + ")";
            }
        }, frequency);
    }
}