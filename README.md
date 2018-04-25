# Oscil
## Audio-Visual Web Application

![Oscil Header Img](https://mir-s3-cdn-cf.behance.net/project_modules/1400/5e466c64019463.5ada9e2d69c5d.jpg)

## Overview
Oscil is an audio-visual web application which takes audio information via a user’s microphone input and uses the resulting waveform to drive various visualisations. These visualisations are intended to be used in both a performance context or simply to accompany leisurely playing of music.

## Dependencies
Oscil was originally developed as a static site using plain old JavaScript. Where the previous static site required bloated boilerplates and was unreliably slow when switching visual libraries, the decision to adopt libraries such as React and the Webpack bundler has helped not only increase the application’s performance but also its maintainability.

![Oscil Component Structure](https://mir-s3-cdn-cf.behance.net/project_modules/1400/ff9c6664019463.5ad9b47860cae.png)

## AudioAnalyser
The role of the AudioAnalyser component is to transform the audio waveform from the user’s microphone into something useful for the canvas components. Using the Web Audio API, the waveform is passed through a number of nodes controlled by the Audio Settings GUI.

![AudioAnalyser Component Process](https://mir-s3-cdn-cf.behance.net/project_modules/1400/87299564019463.5ad9b4785f522.png)

## Audio Sampling
There are a number of methods for using audio information in visualisations. The three most common methods used in Oscil’s current visualisations are:
* Taking a normalized sample from the first index of the audio waveform
* Taking a normalized sample from an index in the waveform which increments each animation frame (and resets once it gets to the end)
* Applying the information from each index of the waveform to a different element

![Audio Sampling Approaches](https://mir-s3-cdn-cf.behance.net/project_modules/fs/502f8c64019463.5ad9b478600f5.png)

## Visualisations
The React application was born out a need to cohesively house various experiments created using the HTML Canvas API, p5.js, and Three.js developed over the course of last year. These visualisations tend to be based on generative or natural algorithms, inspired by the likes of Shiffman’s Nature of Code and Bohnacker et al’s Generative Design (often refactored from Processing).

![Rendering Components](https://mir-s3-cdn-cf.behance.net/project_modules/fs/4698e264019463.5ad9b47861296.png)

### Visual Renderers
Visuals created using three different visual libraries, HTML Canvas API, p5.js, and Three.js, require slightly different initialisations and removal processes. Therefore a component unique to each library was created to handle individual requirements of these ‘renderers’.

### Visual Types
In addition to their ‘renderer’, the visuals are also categorised by their appearance for navigation purposes. Accordingly, Oscil currently contains Calibration, Shape, Image, Video, and 3D ‘types’ of visualisations.

![Different Types of Visuals](https://mir-s3-cdn-cf.behance.net/project_modules/fs/1d54db64019463.5ada7cb98c586.png)

![Oscil Visuals](https://mir-s3-cdn-cf.behance.net/project_modules/fs/f9ec3964019463.5adab259e7010.jpg)
