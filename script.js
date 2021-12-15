console.log("👋");
console.log($ ? "jquery ✅️" : "");

(function () {
    var currentPlayer = "player1";
    var columns = $(".column");
    var allSlots = $(".column .slot");
    var cursor = $(".cursor");
    var transitionCursorDone = true;

    function switchPlayer() {
        $("input.player-name." + currentPlayer).removeClass("playing");
        cursor.removeClass(currentPlayer);
        currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
        $("input.player-name." + currentPlayer).addClass("playing");
        cursor.addClass(currentPlayer);
        console.log("It's " + currentPlayer + "'s turn.");
    }

    function checkVictory(slots) {
        var count = 0;
        for (var slot of slots) {
            if ($(slot).hasClass(currentPlayer)) {
                count++;
                if (count >= 4) {
                    gameover();
                    return true;
                }
            } else {
                count = 0;
            }
        }
        return false;
    }
    function checkDiagVic(colIdx, rowIdx) {
        // console.log("got colIdx: ", colIdx, "and rowIdx: ", rowIdx);

        // for

        // hard coded 🙁
        var diags = [
            [3, 8, 13, 18],
            [4, 9, 14, 19, 24],
            [5, 10, 15, 20, 25, 30],
            [11, 16, 21, 26, 31, 36],
            [17, 22, 27, 32, 37],
            [23, 28, 33, 38],
            [2, 9, 16, 23],
            [1, 8, 15, 22, 29],
            [0, 7, 14, 21, 28, 35],
            [6, 13, 20, 27, 34, 41],
            [12, 19, 26, 33, 40],
            [18, 25, 32, 39],
        ];
        for (var diag of diags) {
            diag = diag.map(function (i) {
                return allSlots[i];
            });
            // console.log("checking diag", diag);
            if (checkVictory(diag)) {
                return true;
            }
        }
        return false;
    }

    function gameover(draw = false) {
        var overlay = $(".gameover");
        var line = $(".gameover p.winner");
        if (draw) {
            line.html("Draw!");
        } else {
            console.log(currentPlayer + " wins!");
            line.html($("input.player-name." + currentPlayer).val() + " wins!");
        }
        overlay.css({ visibility: "visible" });
    }

    function resetBoard() {
        console.log("reset");
        allSlots.removeClass("player1");
        allSlots.removeClass("player2");
        $(".gameover p.winner").html("");
        $(".gameover").css({ visibility: "hidden" });
    }

    $(".restart").on("click", resetBoard);
    $(".gameover p.again").on("click", resetBoard);

    columns.on("mousemove", function (ev) {
        if (!transitionCursorDone) return;
        var step = $(".board").width() / columns.length;
        var cursorOffset = columns.index(ev.currentTarget) * step + 15;
        cursor.css({ left: cursorOffset + "px" });
    });

    columns.on("click", function (ev) {
        var col = ev.currentTarget.children;
        // console.log(col);
        for (var i = col.length - 1; i >= 0; i--) {
            var slot = $(col).eq(i);
            var free = !(slot.hasClass("player1") || slot.hasClass("player2"));
            if (free) {
                cursor.addClass("put");
                cursor.css({
                    top: slot[0].offsetTop + 5 + "px",
                });

                transitionCursorDone = false;
                cursor.on("transitionend", function () {
                    transitionCursorDone = true;
                    cursor.removeClass("put");
                    cursor.css({ top: -90 });
                });
                slot.addClass(currentPlayer);
                break;
            }
        }
        if (i === -1) return; //player did not play
        // col
        if (checkVictory(col)) return;
        // row
        if (checkVictory($(".column .slot:nth-child(" + (i + 1) + ")"))) return;
        // diag
        if (checkDiagVic(columns.index(ev.currentTarget), i)) return;

        // check if slots full for tied game
        var slotsFull = true;
        for (var slot of allSlots) {
            if (!$(slot).hasClass("player1") && !$(slot).hasClass("player2")) {
                slotsFull = false;
                break;
            }
        }
        if (slotsFull) gameover(true);
        // switch if player placed a checker
        switchPlayer();
    });
})();
