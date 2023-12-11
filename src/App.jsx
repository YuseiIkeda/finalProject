import { useEffect, useState } from "react";

async function fetchDogs(speed) {
    const response = await fetch("dogs.json");
    const data = await response.json();

    if (speed >= 20) {
        return data.filter((item) => item.image === "inu_shippo_oikakeru.png");
    } else if (speed >= 5) {
        return data.filter((item) => item.image === "pet_darui_dog.png");
    } else {
        return data.filter((item) => item.image === "sleep_animal_dog.png");
    }
}

export default function App() {
    const [dogs, setDogs] = useState([]);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [prevPosition, setPrevPosition] = useState({ prevX: "", prevY: "" });
    const [prevScrollPosition, setPrevScrollPosition] = useState(0);
    const [buttonPressTime, setButtonPressTime] = useState(0);

    useEffect(() => {
        (async () => {
            const data = await fetchDogs(0);
            setDogs(data);
        })();
    }, []);

    useEffect(() => {
        const handleMouseMove = (event) => {
            const currentX = Math.round(event.clientX);
            const currentY = Math.round(event.clientY);

            setPosition({ x: currentX, y: currentY });

            const mouseSpeed = (prevPosition.prevX !== "" && prevPosition.prevY !== "") ?
                Math.abs(currentX - prevPosition.prevX) +
                Math.abs(currentY - prevPosition.prevY)
                : 0;
            console.log(currentX, prevPosition.prevX);

            setPrevPosition({ prevX: currentX, prevY: currentY });

            (async () => {
                const data = await fetchDogs(mouseSpeed);
                setDogs(data);
            })();
        };

        const handleMouseLeave = () => {
            setPosition({ x: 0, y: 0 });
            setPrevPosition({ prevX: "", prevY: "" });
        };

        const handleMouseUp = () => {
            setPosition({ x: 0, y: 0 });
            setPrevPosition({ prevX: "", prevY: "" });
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [prevPosition]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPosition = window.scrollY;
            const scrollSpeed = Math.abs(currentScrollPosition - prevScrollPosition);

            setPrevScrollPosition(currentScrollPosition);

            (async () => {
                const data = await fetchDogs(scrollSpeed);
                setDogs(data);
            })();
        };

        document.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("scroll", handleScroll);
        };
    }, [prevScrollPosition]);

    const handleButtonPress = () => {
        const pressTime = Date.now();
        setButtonPressTime(pressTime);
    };

    const handleButtonRelease = () => {
        const releaseTime = Date.now();
        const holdPressTime = (releaseTime - buttonPressTime) / 1000;
        //alert(`ボタンを押し始めてから離すまでの時間: ${holdPressTime} 秒`);

        if (holdPressTime < 3) {
            (async () => {
                const data = await fetchDogs(20);
                setDogs(data);
            })();
        }
    };

    function winClose() {
        open('about:blank', '_self').close();    //一度再表示してからClose
    }

    return (
        <>
            <header>
                <h1>Dooooog</h1>
            </header>
            <main style={{ position: "relative", minHeight: "500vh" }}>
                <div style={{ position: "fixed", bottom: 0, right: 30 }}>
                    {dogs.map((dog) => {
                        if (dog.name === "awake dog") {
                            console.log("awake");
                            //setTimeout(alert("あうとー"), 3000);
                        }
                        return (
                            <img
                                key={dog.image}
                                src={`images/${dog.image}`}
                                alt={dog.name}
                                style={{ width: "200px", height: "auto" }}
                            />
                        );
                    })}
                </div>
                <button onMouseDown={handleButtonPress} onMouseUp={handleButtonRelease}>
                    ボタンだよ
                </button>
                <button type="button" onclick={winClose}>
                    閉じたい
                </button>
            </main>
            <footer>
                <h2>X: {position.x}, Y: {position.y}</h2>
            </footer>
        </>
    );
}
