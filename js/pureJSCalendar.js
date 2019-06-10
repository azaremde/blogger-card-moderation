//private calendar controller IIFE
var mobile = parseInt($(window).width()) < 768;

var pureJSCalendar = (function () {
    let wrap, label, calYear, calMonth, calDateFormat, firstDay, isIE11, opened, openedInput;

    isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

    //check global variables for calendar widget and set default localization values
    if (window.months === undefined) {
        window.months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    }

    if (window.shortDays === undefined) {
        window.shortDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    }

    //first day of week combinations array
    const firstDayCombinations = [
        [0, 1, 2, 3, 4, 5, 6],
        [1, 2, 3, 4, 5, 6, 0],
        [2, 3, 4, 5, 6, 0, 1],
        [3, 4, 5, 6, 0, 1, 2],
        [4, 5, 6, 0, 1, 2, 3],
        [5, 6, 0, 1, 2, 3, 4],
        [6, 0, 1, 2, 3, 4, 5]
    ]

    //DOM strings helper
    const DOMstrings = {
        divCal: 'cal',
        divCalQ: '#cal',
        monthLabel: 'label',
        btnPrev: 'prev',
        btnNext: 'next',
        sunLabel: 'eformSun',
        monLabel: 'eformMon',
        tueLabel: 'eformTue',
        wedLabel: 'eformWed',
        thuLabel: 'eformThu',
        friLabel: 'eformFri',
        satLabel: 'eformSat',
        tdDay: '.eformDay'
    }

    let openBtns = document.getElementsByClassName('open-calendar');
    
    for(var i = 0; i < openBtns.length; i++) {
        openBtns[i].addEventListener('click', () => {
            if(opened) {
                close();
            }
        });
    }

    let calendarsExist = document.getElementsByClassName('open-calendar').length;
    let chosenDate = Array(calendarsExist);
    

    $(document).ready(() => {
        $.map($('input'), (el) => {
            $(el).on('click', () => {
                if(!$(el).hasClass('open-calendar')) {
                    close();
                }
            });
        });

        $.map($('select'), (el) => {
            $(el).on('click', () => {
                close();
            });
        });

        $.map($('.dropdown'), (el) => {
            $(el).on('click', () => {
                close();
            });
        });

        $.map($('.option'), (el) => {
            $(el).on('click', () => {
                close();
            });
        });

        $.map($('.custom-text-area'), (el) => {
            $(el).on('click', () => {
                close();
            });
        });

        $.map($('button'), (el) => {
            $(el).on('click', () => {
                close();
            });
        });
    });

    //open function
    function open(dateFormat, x, y, firstDayOfWeek, minDate, maxDate, element, zindex, el) {
        //prevent to open more than one calendar
        if (document.getElementById('cal')) {
            return false;
        }

        //init def props
        eFormMinimalDate = DateParse(minDate);
        eFormMaximalDate = DateParse(maxDate);
        //eFormCalendarElement = element;
        eFormCalendarElement = el;
        firstDay = firstDayOfWeek;

        openedInput = el;

        //set default first date of week
        if (firstDayOfWeek === undefined) {
            firstDayOfWeek = 6;
        } else {
            firstDayOfWeek -= 1;
        }

        //create html and push it into DOM
        const newHtml = '<div id="cal"><div class="header-cal"><span class="left button-c" id="prev"></span><span class="left hook"></span><span class="month-year" id="label"> June 20&0 </span><span class="right hook"></span><span class="right button-c" id="next"></span></div ><table id="days"><tr><td id="eformSun">sun</td><td id="eformMon">mon</td><td id="eformTue">tue</td><td id="eformWed">wed</td><td id="eformThu">thu</td><td id="eformFri">fri</td><td id="eformSat">sat</td></tr></table><div id="cal-frame"><table class="curr"><tbody></tbody></table></div></div >'
        //document.getElementById('calendar').insertAdjacentHTML('beforeend', newHtml);
        el.parentElement.insertAdjacentHTML('beforeend', newHtml);

        calDateFormat = dateFormat;
        wrap = document.getElementById(DOMstrings.divCal);
        label = document.getElementById(DOMstrings.monthLabel);

        //register events
        document.getElementById(DOMstrings.btnPrev).addEventListener('click', function () { switchMonth(false); });
        document.getElementById(DOMstrings.btnNext).addEventListener('click', function () { switchMonth(true); });
        label.addEventListener('click', function () { switchMonth(null, new Date().getMonth(), new Date().getFullYear()); });

        //shorter day version labels
        const dayCombination = firstDayCombinations[firstDayOfWeek];

        document.getElementById(DOMstrings.sunLabel).textContent = window.shortDays[dayCombination[0]];
        document.getElementById(DOMstrings.monLabel).textContent = window.shortDays[dayCombination[1]];
        document.getElementById(DOMstrings.tueLabel).textContent = window.shortDays[dayCombination[2]];
        document.getElementById(DOMstrings.wedLabel).textContent = window.shortDays[dayCombination[3]];
        document.getElementById(DOMstrings.thuLabel).textContent = window.shortDays[dayCombination[4]];
        document.getElementById(DOMstrings.friLabel).textContent = window.shortDays[dayCombination[5]];
        document.getElementById(DOMstrings.satLabel).textContent = window.shortDays[dayCombination[6]];

        //fire inicialization event trigger
        label.click();

        setTimeout(() => {
            opened = true;
        }, 100);

        $('#cal').offset({
            top: $(openedInput).offset().top + 40
        });

        for(var i = 0; i < document.getElementsByClassName('eformDay').length; i++) {
            document.getElementsByClassName('eformDay')[i].classList.remove('chosen-date');
        }

        if(chosenDate[parseInt(el.classList[3].substring('open-calendar--'.length), 10)] != undefined) {
            chosenDate[parseInt(el.classList[3].substring('open-calendar--'.length), 10)].classList.add('chosen-date');
        }

    }

    function updateDate(mont) {
        var month = mont + 1;

        var tDay = "";
        var tMonth = "";

        try {
            tDay += eFormCalendarElement.value[0];
            tDay += eFormCalendarElement.value[1];
    
            tMonth += eFormCalendarElement.value[3];
            tMonth += eFormCalendarElement.value[4];
            
            tDay = parseInt(tDay);
            tMonth = parseInt(tMonth);
        } catch {
        }

        for(var i = 0; i < document.getElementsByClassName('eformDay').length; i++) {
            document.getElementsByClassName('eformDay')[i].classList.remove('chosen-date');
        }

        if(tMonth == month) {
            for(var i = 0; i < document.getElementsByClassName('eformDay').length; i++) {
                if(document.getElementsByClassName('eformDay')[i].innerHTML == tDay) {
                    document.getElementsByClassName('eformDay')[i].classList.add('chosen-date');

                    chosenDate[parseInt(openedInput.classList[3].substring('open-calendar--'.length), 10)] = document.getElementsByClassName('eformDay')[i];
                }
            }
        }
    }

    //switches current month
    function switchMonth(next, month, year) {
        var curr = label.textContent.trim().split(' '), calendar, tempYear = parseInt(curr[1], 10);
        if (month === undefined) {
            month = ((next) ? ((curr[0] === window.months[11]) ? 0 : months.indexOf(curr[0]) + 1) : ((curr[0] === window.months[0]) ? 11 : months.indexOf(curr[0]) - 1));
        }

        
        if (!year) {
            if (next && month === 0) {
                year = tempYear + 1;
            } else if (!next && month === 11) {
                year = tempYear - 1;
            } else {
                year = tempYear;
            }
        }

        //set month and year for widget scope
        calMonth = month + 1;
        calYear = year;

        calendar = createCal(year, month);

        var curr = document.querySelector('.curr')
        curr.innerHTML = '';
        curr.appendChild(calendar.calendar());
        
        updateDate(month);

        /*
        //disable days below minimal date
        if (eFormMinimalDate !== undefined) {
            if (year < eFormMinimalDate.year || year <= eFormMinimalDate.year && month <= eFormMinimalDate.month - 1) {
                const emptyCount = document.querySelector('.curr table').rows[0].querySelectorAll('td:empty').length;
                const tdDisabled = document.querySelectorAll('.eformDay');
                for (var i = 0; i < tdDisabled.length; ++i) {
                    if (i - emptyCount + 1 < eFormMinimalDate.day || month < eFormMinimalDate.month - 1 || year < eFormMinimalDate.year) {
                        tdDisabled[i].classList.add('eformDayDisabled');
                        tdDisabled[i].onclick = function () {
                            return false;
                        }
                    }
                }
            }
        }

        //disable days above maximal date
        if (eFormMaximalDate !== undefined) {
            if (year > eFormMinimalDate.year || year >= eFormMaximalDate.year && month >= eFormMaximalDate.month - 1) {
                const emptyCount = document.querySelector('.curr table').rows[0].querySelectorAll('td:empty').length;
                const tdDisabled = document.querySelectorAll('.eformDay');
                for (var i = 0; i < tdDisabled.length; ++i) {
                    if (i - emptyCount + 1 > eFormMaximalDate.day || month > eFormMaximalDate.month - 1 || year > eFormMaximalDate.year) {
                        tdDisabled[i].classList.add('eformDayDisabled');
                        tdDisabled[i].onclick = function () {
                            return false;
                        }
                    }
                }
            }
        }
        */

        label.textContent = calendar.label;
    }

    //main calendar function. Creates calendar itself and stores into cache
    function createCal(year, month) {
        var day = 1, i, j, haveDays = true,
            startDay = new Date(year, month, day).getDay(),
            daysInMonths = [31, (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            calendar = [];

        startDay -= firstDay;
        if (startDay < 0) {
            startDay = 7 + startDay;
        }

        if (createCal.cache[year] && !isIE11) {
            if (createCal.cache[year][month]) {
                return createCal.cache[year][month];
            }
        } else {
            createCal.cache[year] = {};
        }

        i = 0;
        while (haveDays) {
            calendar[i] = [];
            for (j = 0; j < 7; j++) {
                if (i === 0) {
                    if (j === startDay) {
                        calendar[i][j] = day++;
                        startDay++;
                    }
                } else if (day <= daysInMonths[month]) {
                    calendar[i][j] = day++;
                } else {
                    calendar[i][j] = '';
                    haveDays = false;
                }
                if (day > daysInMonths[month]) {
                    haveDays = false;
                }
            }
            i++;
        }

        ////6th week of month fix IF NEEDED
        //if (calendar[5]) {
        //    for (i = 0; i < calendar[5].length; i++) {
        //        if (calendar[5][i] !== '') {
        //            calendar[4][i] = '<span>' + calendar[4][i] + '</span><span>' + calendar[5][i] + '</span>';
        //        }
        //    }
        //    calendar = calendar.slice(0, 5);
        //}

        for (i = 0; i < calendar.length; i++) {
            calendar[i] = '<tr><td class="eformDay" onclick="pureJSCalendar.dayClick(this)">' + calendar[i].join('</td><td class="eformDay" onclick="pureJSCalendar.dayClick(this)">') + '</td></tr>';
        }        

        const calendarInnerHtml = calendar.join('');
        calendar = document.createElement('table', { class: 'curr' });
        calendar.innerHTML = calendarInnerHtml;
        const tdEmty = calendar.querySelectorAll('td:empty');
        for (var i = 0; i < tdEmty.length; ++i) {
            tdEmty[i].classList.add('nil');
        }
        if (month === new Date().getMonth()) {
            const calTd = calendar.querySelectorAll('td');
            const calTdArray = Array.prototype.slice.call(calTd); 
            calTdArray.forEach(function (current, index, array) {
                if (current.innerHTML === new Date().getDate().toString()) {
                    current.classList.add('today');
                }
            });
        }

        createCal.cache[year][month] = { calendar: function () { return calendar }, label: months[month] + ' ' + year };//calendar.clone()

        return createCal.cache[year][month];
    }
    createCal.cache = {};

    //day click event function => than close
    const dayClick = function (element) {
        const dateResult = DateToString(new Date(calYear, calMonth-1, parseInt(element.innerHTML)), calDateFormat);

        if(!dateResult.includes('N')) {
            openedInput.value = dateResult;
        }
        
        close();
    }

    // join
    function joinObj(obj, seperator) {
        var out = [];
        for (k in obj) {
            out.push(k);
        }
        return out.join(seperator);
    }

    //returns string in desired format
    function DateToString(inDate, formatString) {
        var dateObject = {
            M: inDate.getMonth() + 1,
            d: inDate.getDate(),
            D: inDate.getDate(),
            h: inDate.getHours(),
            m: inDate.getMinutes(),
            s: inDate.getSeconds(),
            y: inDate.getFullYear(),
            Y: inDate.getFullYear()
        };
        // Build Regex Dynamically based on the list above.
        // Should end up with something like this "/([Yy]+|M+|[Dd]+|h+|m+|s+)/g"
        var dateMatchRegex = joinObj(dateObject, "+|") + "+";
        var regEx = new RegExp(dateMatchRegex, "g");
        formatString = formatString.replace(regEx, function (formatToken) {
            var datePartValue = dateObject[formatToken.slice(-1)];
            var tokenLength = formatToken.length;
            
            if (formatToken === 'MMMM') {
                return window.months[dateObject.M - 1];
            }

            // A conflict exists between specifying 'd' for no zero pad -> expand to '10' and specifying yy for just two year digits '01' instead of '2001'.  One expands, the other contracts.
            // so Constrict Years but Expand All Else
            if (formatToken.indexOf('y') < 0 && formatToken.indexOf('Y') < 0) {
                // Expand single digit format token 'd' to multi digit value '10' when needed
                var tokenLength = Math.max(formatToken.length, datePartValue.toString().length);
            }
            var zeroPad;
            try {
                zeroPad = (datePartValue.toString().length < formatToken.length ? "0".repeat(tokenLength) : "");
            } catch (ex) {//IE11 repeat catched
                zeroPad = (datePartValue.toString().length < formatToken.length ? repeatStringNumTimes("0", tokenLength) : "");
            }
            return (zeroPad + datePartValue).slice(-tokenLength);
        });

        return formatString;
    }
    Date.prototype.ToString = function (formatStr) { return DateToString(this.toDateString(), formatStr); }

    //IE11 repeat alternative
    function repeatStringNumTimes(string, times) {
        var repeatedString = "";
        while (times > 0) {
            repeatedString += string;
            times--;
        }
        return repeatedString;
    }

    //close event function (fadeout)
    function close() {
        fadeOutEffect(DOMstrings.divCalQ, remove);
        if(!document.getElementById('txtTest').value.includes('ДД')) {
            if(document.getElementById('txtTest').parentElement.classList.contains('form-part--warning')) {
                document.getElementById('txtTest').parentElement.classList.remove('form-part--warning');
            }
        }

        el = undefined;

        opened = false;
    }

    //remove calendar box
    var remove = function () {
        try {
            document.getElementById(DOMstrings.divCal).remove();
        } catch (ex) {//ie11 fix
            const child = document.getElementById(DOMstrings.divCal);
            child.parentNode.removeChild(child);
        }
    }

    //parse date
    function DateParse(date) {
        let parsedDate, newDate;
        const currentDate = date;
        
        if (currentDate != null) {
            splitedDate = currentDate.split('-');
            newDate = { year: splitedDate[0], month: splitedDate[1], day: splitedDate[2] };
        }

        return newDate;
    }

    //function accesibility
    return {
        open: open,
        switchMonth: switchMonth,
        createCal: createCal,
        dayClick: dayClick,
        close: close
    };
})();

//plain javascript fadeout alternative
function fadeOutEffect(selector, callback) {
    var fadeTarget = document.querySelector(selector);
    if (fadeTarget != null) {
        var fadeEffect = setInterval(function () {
            if (!fadeTarget.style.opacity) {
                fadeTarget.style.opacity = 1;
            }
            if (fadeTarget.style.opacity > 0) {
                fadeTarget.style.opacity -= 0.1;
            } else {
                clearInterval(fadeEffect);
                callback();
            }
        }, 20);
    }
}
