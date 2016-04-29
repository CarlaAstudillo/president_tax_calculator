var pymChild = null;


var json = {


    "Hillary Clinton": {
        "percentile1": 0.000,
        "percentile2": -0.001,
        "percentile3": -0.001,
        "percentile4": -0.002,
        "percentile5": -0.002,
        "percentile6": -0.003,
        "percentile7": -0.008,
        "percentile8": -0.050,
        "percentile9": -0.076,
        "img": "https://s3-us-west-2.amazonaws.com/ibt-viz/2016/candidates/circles/clinton_c.png",
        "quip": "No new taxes, unless you’re rich."
    },
    "Ted Cruz": {
        "percentile1": 0.004,
        "percentile2": 0.019,
        "percentile3": 0.032,
        "percentile4": 0.049,
        "percentile5": 0.062,
        "percentile6": 0.081,
        "percentile7": 0.121,
        "percentile8": 0.260,
        "percentile9": 0.290,
        "img": "https://s3-us-west-2.amazonaws.com/ibt-viz/2016/candidates/circles/cruz_c.png",
        "quip": "The tax code is broken. Let’s change it completely."
    },
    "Marco Rubio": {
        "percentile1": 0.013,
        "percentile2": 0.011,
        "percentile3": 0.020,
        "percentile4": 0.024,
        "percentile5": 0.032,
        "percentile6": 0.032,
        "percentile7": 0.032,
        "percentile8": 0.089,
        "percentile9": 0.115,
        "img": "https://s3-us-west-2.amazonaws.com/ibt-viz/2016/candidates/circles/rubio_c.png",
        "quip": "Children are the future. Oh, and a tax break too."
    },
    "Bernie Sanders": {
        "percentile1": -0.013,
        "percentile2": -0.051,
        "percentile3": -0.085,
        "percentile4": -0.098,
        "percentile5": -0.103,
        "percentile6": -0.099,
        "percentile7": -0.116,
        "percentile8": -0.335,
        "percentile9": -0.448,
        "img": "https://s3-us-west-2.amazonaws.com/ibt-viz/2016/candidates/circles/bernie_c.png",
        "quip": "Single-payer healthcare isn’t free."
    },

    "Donald Trump": {
        "percentile1": 0.010,
        "percentile2": 0.031,
        "percentile3": 0.049,
        "percentile4": 0.058,
        "percentile5": 0.054,
        "percentile6": 0.057,
        "percentile7": 0.085,
        "percentile8": 0.175,
        "percentile9": 0.189,
        "img": "https://s3-us-west-2.amazonaws.com/ibt-viz/2016/candidates/circles/trump_c.png",
        "quip": "Your tax cut's gonna be yuuuge."
    }

}

var json2 = {
    "0%-20%": {
        "annualincome": 20000,
        "paycheck": 678
    },
    "21%-40%": {
        "annualincome": 35000,
        "paycheck": 1161
    },
    "41%-60%": {
        "annualincome": 55000,
        "paycheck": 1743
    },
    "61%-80%": {
        "annualincome": 100000,
        "paycheck": 2998
    },

    "81%-90%": {
        "annualincome": 180000,
        "paycheck": 5143
    },
    "91%-95%": {
        "annualincome": 250000,
        "paycheck": 6899
    },
    "96%-99%": {
        "annualincome": 500000,
        "paycheck": 12853
    },
    "Top 1%": {
        "annualincome": 1000000,
        "paycheck": 23843
    },

    "Top 0.1%": {
        "annualincome": 5000000,
        "paycheck": 117254
    }


}




$(window).load(function() {

    function commaSeparateNumber(val) {
        while (/(\d+)(\d{3})/.test(val.toString())) {
            val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
        }
        return val;
    }

    $('.selectpicker').selectpicker({
        size: 9
    });




    $('.selectpicker').change(function() {


        var selectedPercentile = $(this).find("option:selected").text();

        function matchPercentile(classMatch) {
            $.each(json2, function(key, data) {

                if (key == selectedPercentile) {




                    $('#annual-income').val(commaSeparateNumber(data.annualincome));

                    $('#paycheck_amt').val(commaSeparateNumber(data.paycheck));

                }



            })




        }

        matchPercentile(selectedPercentile)
    });




    $("input[type='text']").keyup(function(event) {
        if (event.which >= 37 && event.which <= 40) {
            event.preventDefault();
        }
        var $this = $(this);
        var num = $this.val().replace(/,/gi, "").split("").reverse().join("");

        var num2 = AddAutomaticCommas(num.replace(/(.{3})/g, "$1,").split("").reverse().join(""));

        $this.val(num2);
    });


    $("#submit").click(function() {
        var trHTML = '';

        $('.results').html('')


        var money = $('#annual-income').val();

        function removeCommas(str) {
            while (str.search(",") >= 0) {
                str = (str + "").replace(',', '');
            }
            return str;
        };

        var paycheck = $('#paycheck_amt').val();

        var moneynum = removeCommas(money);
        var paychecknum = removeCommas(paycheck);


        if ($.isNumeric(moneynum)) {
            $("#input_results").html("")
            $("h3").html("Here’s how your biweekly paycheck will change:")

            var whatclass = DivideintoClass(moneynum)


            function matchCand(classMatch) {

                $.each(json, function(key, data) {

                    var pay_results = paychecknum * data[classMatch]

                    if (pay_results >= 0) {

                        trHTML += '<div id="candrow"><div class="add"> +$' + parseFloat(pay_results, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString() + '</div><img src="' + data.img + '"><div id="candidate">' + key + '</div><div id="quip">' + data.quip + '</div></div><hr>';



                    } else {

                        trHTML += '<div id="candrow"><div class="takeaway"> -$' + parseFloat(pay_results * -1, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString() + '</div><img src="' + data.img + '"><div id="candidate">' + key + '</div><div id="quip">' + data.quip + '</div></div><hr>';


                    }




                });

                $('.results').append(trHTML);

                $('.results').waitForImages(function() {
                    pymChild.sendHeight();
                });




            };

            matchCand(whatclass)




        } else {
            $("#input_results").html("Oops, that's not a valid number. Try again.")
        }




    });


    function AddAutomaticCommas(convertString) {


        if (convertString.substring(0, 1) == ",") {

            return convertString.substring(1, convertString.length)

        }
        return convertString;

    }

    function DivideintoClass(num) {


        if (num <= 23099) {

            $(".class_order").html("Because you're in the <b>0-20% income percentile</b>:")

            return "percentile1"

        } else if (num >= 23100 && num <= 45153) {
            $(".class_order").html("Because you're in the <b>21-40% income percentile</b>:")
            return "percentile2"
        } else if (num >= 45154 && num <= 80760) {
            $(".class_order").html("Because you're in the <b>41-60% income percentile</b>:")
            return "percentile3"
        } else if (num >= 80761 && num <= 142601) {
            $(".class_order").html("Because you're in the <b>61-80% income percentile</b>:")
            return "percentile4"
        } else if (num >= 142602 && num <= 209113) {
            $(".class_order").html("Because you're in the <b>81-90% income percentile</b>:")
            return "percentile5"
        } else if (num >= 209114 && num <= 295756) {
            $(".class_order").html("Because you're in the <b>91-95% income percentile</b>:")
            return "percentile6"
        } else if (num >= 295757 && num <= 732323) {
            $(".class_order").html("Because you're in the <b>95-99% income percentile</b>:")
            return "percentile7"
        } else if (num >= 732324 && num <= 3769396) {
            $(".class_order").html("Because you're in the <b>Top 1% income percentile</b>:")
            return "percentile8"
        } else if (num >= 3769397) {
            $(".class_order").html("Because you're in the <b>Top 0.1% income percentile:</b>")
            return "percentile9"
        }




    }



    pymChild = new pym.Child();



});