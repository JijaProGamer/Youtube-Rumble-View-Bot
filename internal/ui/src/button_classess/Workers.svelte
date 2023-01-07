<script>
  export let current_workers;
  export let finished_workers;
  export let queue_workers;
  export let start_time = Date.now();
  export let container_type = "current";

  function changeContainer_current() {
    container_type = "current";
  }
  function changeContainer_finished() {
    container_type = "finished";
  }
  function changeContainer_queue() {
    container_type = "queue";
  }

  function workerBandwith(workers){
    return workers.reduce((a, b) => a + b.bandwith, 0) / 1e6 || 0
  }

  function averageBandwithPerWorker_time_l(workers){
    let result = workers.reduce((total, next) => {
      let workerTime = ((next.finish_time || Date.now()) - next.start_time) / 1000
      let bandwith_time = (next.bandwith / 1e+6) / (workerTime / 60)

      return total + bandwith_time
    }, 0)

    return result || 0
  }

  function averageBandwithPerWorker_time(workers){
    let result = workers.reduce((total, next) => {
      let workerTime = ((next.finish_time || Date.now()) - next.start_time) / 1000
      let bandwith_time = (next.bandwith / 1e+6) / (workerTime / 60)

      return total + bandwith_time
    }, 0) / workers.length

    return result || 0
  }

  function averageBandwithPerWorker(workers){
    let result = workers.reduce((total, next) => {
      let bandwith_time = (next.bandwith / 1e+6)

      return total + bandwith_time
    }, 0) / workers.length

    return result || 0
  }

  function toTime(value) {
    return value / ((Date.now() - start_time) / 60000)
  }
</script>

<div id="workers_container">
  <h1 id="type_label">WORKERS</h1>
  {#if container_type == "finished"}
    <div class="element_container">
      <p class="element_id">
        Total bandwith: {workerBandwith(finished_workers).toFixed(2)} megabits
      </p>
      <p class="element_id">
        Total bandwith: {averageBandwithPerWorker_time_l(finished_workers).toFixed(2)} megabits/minute
      </p>
      <p class="element_id">
        average bandwith per worker: {averageBandwithPerWorker(finished_workers).toFixed(2)} megabits
      </p>
      <p class="element_id">
        average bandwith per worker: {averageBandwithPerWorker_time(finished_workers).toFixed(2)} megabits/minute
      </p>
    </div>
  {/if}

  {#if container_type == "current"}
    <div class="element_container">
      <p class="element_id">
        Total bandwith: {(workerBandwith(current_workers) || 0).toFixed(2)} megabits
      </p>
      <p class="element_id">
        Total bandwith: {averageBandwithPerWorker_time_l(current_workers).toFixed(2)} megabits/minute
      </p>
      <p class="element_id">
        average bandwith per worker: {averageBandwithPerWorker(current_workers).toFixed(2)} megabits
      </p>
      <p class="element_id">
        average bandwith per worker: {averageBandwithPerWorker_time(current_workers).toFixed(2)} megabits/minute
      </p>
    </div>
  {/if}
</div>

<div id="types_container">
  <button
    on:click={changeContainer_current}
    id="button_current"
    class="type_button{(container_type == 'current' &&
      ' selected_class_button') ||
      ''}">CURRENT</button
  >
  <button
    on:click={changeContainer_finished}
    id="button_finished"
    class="type_button{(container_type == 'finished' &&
      ' selected_class_button') ||
      ''}">FINISHED</button
  >
  <button
    on:click={changeContainer_queue}
    id="button_queue"
    class="type_button{(container_type == 'queue' &&
      ' selected_class_button') ||
      ''}">QUEUE</button
  >
</div>

<div id="elements_container">
  {#if container_type == "current"}
    {#each current_workers as worker, index}
      <div class="element_container">
        <p class="element_id">#{index + 1}</p>
        <br />
        <div class="element_sort1">
          <p class="element_num">
            WORKER #{worker.totalWorked}/{current_workers.length +
              finished_workers.length +
              queue_workers.length}
          </p>
          <p class="element_duration">
            DURATION: {worker.job.watchTime.toFixed(1)} sec
          </p>
        </div>

        <div class="element_sort2">
          <p class="element_bandwidth">
            BANDWIDTH: {(worker.bandwith / 1e6).toFixed(1)} mb
          </p>
          <p class="element_watchtime">
            WATCH TIME: {worker.current_time.toFixed(1)} sec
          </p>
        </div>
      </div>
    {/each}
  {:else if container_type == "finished"}
    {#each finished_workers as worker, index}
      <div
        class="element_container proxy_{(worker.errors.length > 0 && 'bad') ||
          'good'}"
      >
        <p class="element_id">#{index + 1}</p>
        <br />
        <div class="element_sort1">
          <p class="element_num">
            WORKER #{worker.totalWorked}/{current_workers.length +
              finished_workers.length +
              queue_workers.length}
          </p>
          <p class="element_duration">
            DURATION: {worker.job.watchTime.toFixed(1)} sec
          </p>
        </div>

        <div class="element_sort2">
          <p class="element_bandwidth">
            BANDWIDTH: {(worker.bandwith / 1e6).toFixed(1)} mb
          </p>
        </div>
      </div>
    {/each}
  {:else if container_type == "queue"}
    {#each queue_workers as worker, index}
      <div class="element_container">
        <p class="element_id">#{index + 1}</p>
        <br />
        <div class="element_sort1">
          <p class="element_num">
            WORKER #{index + 1}/{current_workers.length +
              finished_workers.length +
              queue_workers.length}
          </p>
          <p class="element_duration">
            DURATION: {worker.watchTime.toFixed(1)} sec
          </p>
        </div>

        <div class="element_sort2" />
      </div>
    {/each}
  {/if}
</div>
