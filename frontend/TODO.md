- experiment with Selenium / VLC

- Queue system
    - Send queue request to a server running on computer; server has queue array in memory, an array of objects with video title, thumbnail, and length (in seconds?)
    - Let server continuously pull every 1 minute for the next video in queue
    - If there is a video in queue, play it with VLC and set a timeout for the song length + 1 minute or so
    - After that timeout, continue pulling every 1 minute
- Stop previous playing video if new video clicked
- Add automatic "+ karaoke" to search
- Record emails + record favorites/history