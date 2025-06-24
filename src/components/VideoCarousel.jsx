import React, { useEffect, useRef, useState } from 'react'
import { hightlightsSlides } from '../constants'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { pauseImg, playImg, replayImg } from '../utils'
const VideoCarousel = () => {
    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    })

    const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;
    const [loadedData, setLoadedData] = useState([]);

    

    useEffect(() => {

        if (loadedData.length > 3) {//si on arrive a la derniere video
            console.log('the data'. loadedData)
            if (!isPlaying) {// et on est plus entrain de les play
               videoRef.current[videoId].pause(); //alors pause la video actuelle
            } else {
                startPlay && videoRef.current[videoId].play()
            }
        }

    }, [startPlay, videoId, isPlaying, loadedData])

    const handleLoadedMetaData = (i, e)=> setLoadedData((previous)=>[...previous, e])

    useEffect(() => {
        const currentProgress = 0;
        let span = videoSpanRef.current;

        if (span[videoId]) {
            // animate the progress of the video

            let anim = gsap.to(span[videoId], {
                onUpdate: () => {

                },

                onComplete: () => {

                }
            })
        }
    }, [videoId, startPlay])

    const handleProcess = (type, i) => {
        switch (type) {
            case 'video-end':
                setVideo((prevVideo) => (
                    { ...prevVideo, isEnd: true }
                ))
                break;
            case 'video-last':
                setVideo((prevVideo) => (
                    { ...prevVideo, isLastVideo: true }
                ))
                break;
            case 'video-reset':
                setVideo((prevVideo) => (
                    { ...prevVideo, isLastVideo: true, videoId: 0 }))
                break;
            case 'play':
                setVideo((prevVideo) => (
                    { ...prevVideo, isPlaying: !prevVideo.isPlaying }))
                break;

            default:
                return video;
        }
    }


    useGSAP(() => {
        gsap.to('#video', {
            scrollTrigger:{
                trigger: '#video',
                toggleActions:'restart none none none'
            },
            onComplete: ()=>{
                setVideo((previous)=>({
                    ...previous,
                    startPlay: true,
                    isPlaying:true,

                }))
            }
        }

        )
    })
    return (
        <>
            <div className="flex items-center">
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id="slider" className="sm:pr-20 pr-10">
                        <div className="video-carousel_container">
                            <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                                <video id="video"
                                    playsInline={true}
                                    preload='auto'
                                    muted
                                    ref={(el) => (videoRef.current[i] = el)}
                                    onPlay={() => {
                                        setVideo((prevVideo) => ({
                                            ...prevVideo, isPlaying: true
                                        }))
                                    }}
                                    onLoadedMetadata={(e)=>
                                        handleLoadedMetaData(i,e)
                                    }
                                >
                                    <source src={list.video} />
                                </video>
                            </div>

                            <div className="absolute top-12 left-[5%] z-10">
                                {list.textLists.map((text) => (
                                    <p key={text} className='md:text-2xl text-xl font-medium'>
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            <div className='relative flex-center mt-10'>
                <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
                    {videoRef.current.map((_, i) => (
                        <span
                            key={i}
                            ref={(el) => (videoRef.current[i] = el)}
                            className='mx-2 w-3 h-3 bg-gray-200 rounded-full cursor-pointer relative'
                        >
                            <span className='absolute h-full w-full rounded-full' ref={(el) => (videoSpanRef.current[i] = el)} />

                        </span>
                    ))}
                </div>

                <button className='control-btn'>
                    <img src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg} alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
                        onClick={isLastVideo ? () => handleProcess('video-reset')
                            : !isPlaying ? () => handleProcess('play') : () => handleProcess('pause')}
                    />

                </button>

            </div>
        </>
    )
}

export default VideoCarousel
