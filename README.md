🚨 **LOOKING FOR HELP! If you're in a non-UK country I'd really appreciate your help testing modem behaviour and settings with different caller ID transmission formats e.g FSK/DTMF** 🚨

# Badcaller

A Raspberry Pi-enabled caller ID system which checks incoming landline calls against databases (UK-only for now) of known malicious callers, and displays a danger rating of the incomming caller on a web browser.

## Hardware requirements

1. A Raspberry Pi 2 or greater

   - Raspberry Pi <2 & Raspberry Pi Zero not tested
   - Memory requirements unknown, but 1GB has proven sufficient

2. A USB Serial modem with Caller ID support and a line in/out such as [this one on amazon](https://www.amazon.co.uk/gp/product/B016MXLCEQ/ref=ppx_yo_dt_b_asin_title_o01_s00?ie=UTF8&psc=1)

## Running on your Raspberry Pi

All the software required is run on your Pi via Docker.

### Assumptions

- Your Pi was imaged in as vanilla a way as possible, ideally with Raspberry Pi OS (32 bit)
- You've already imaged it, booted it and made it available on your home network
- You know your Raspberry's IP address.
- You've connected your phone line to the "line" socket of your modem, and the your actual phone to the "phone" socket.
- Your USB modem is plugged into a USB slot on your Pi

### Instruction

1. Shell into your Pi
2. [Install docker](https://phoenixnap.com/kb/docker-on-raspberry-pi)
3. Install docker-compose:

   - Docker's [primary installation process for linux](https://docs.docker.com/compose/install/#install-compose-on-linux-systems) didn't work for me. I ended up using: `sudo pip3 install docker-compose`

4. Clone this repo to any location you prefer on your Pi.
   - You don't need the whole repo if you're not planning to modify the code. Only the `docker-compose.yml` in the root is necessary for running on your Pi.
5. Run `docker-compose up -d` from the directory created when you checked out this repo.
   - Running with `-d` is important if you want it to continue running when you exit your the Pi's shell
6. Visit the IP of your Raspberry in a browser tab on a separate computer or phone.
7. You're done! When a call comes in, you should see it come up on the browser. Try calling your landline with your mobile.

   - You should find yourself at a screen indicating that (presumably) your phone line is inactive.
   - Any significant errors should be visible at the top of the page. Hopefully none are visible.

## Keeping your version up to date

The docker-compose file includes [Watchtower](https://containrrr.dev/watchtower/) which will continuously monitor dockerhub for changes and automatically redeploy the newer container version to your Pi, without manual intervention. Feel free to disable this.

Watchtower will keep the Badcaller container up to date whenever you run docker-compose, even if you don't run it in the background.

---

## Development

### Installation

```
cd server && npm i
cd client && npm i
```

### Running

```
cd server && npm run dev
cd client && npm run start
```

### Simulating serial data during testing

1. Install socat: `sudo apt-get install socat`
2. Start a socat session `socat -d -d pty,raw,echo=0 pty,raw,echo=0`
3. Set the serial port for your `docker-compose up` or `npm run dev` command to be the first of the PTYs created by socat e.g /dev/pts/1
4. Send commands to that port: `echo "RING=" > /dev/pts/1`

### Building

1. Run installation steps
2. Run `./makedocker.sh`

---

### Acknowledgements

https://github.com/kjepper/CallerPi A repo I stumbled across during research that already achieved the crux of what I have here and proved what was possible.

### Support

None.

```

```
