/* -*- mode: javascript; js-indent-level: 2 -*- */
import { BehaviorSubject, from } from "rxjs";
import soundswallower_factory, {
  Decoder,
  SoundSwallowerModule,
} from "soundswallower";

import { Injectable } from "@angular/core";

var soundswallower: SoundSwallowerModule;

@Injectable({
  providedIn: "root",
})
export class SoundswallowerService {
  alignerReady$ = new BehaviorSubject<boolean>(false);
  constructor() {}

  decoder: Decoder;
  async initialize$({
    hmm = "model/en-us",
    loglevel = "INFO",
    samprate = 44100,
    beam = 1e-100,
    wbeam = 1e-100,
    pbeam = 1e-100,
  }) {
    if (soundswallower === undefined)
      soundswallower = await soundswallower_factory();
    this.decoder = new soundswallower.Decoder({
      loglevel,
      hmm,
      samprate,
      beam,
      wbeam,
      pbeam,
    });
    this.decoder.unset_config("dict");
    return await this.decoder.initialize();
  }

  async addDict(dict: any) {
    const n = dict.length;
    let idx = 0;
    for (const word in dict) {
      const pron = dict[word];
      console.log(`adding word ${word} with phones ${pron}`);
      await this.decoder.add_word(word, pron, idx === n - 1);
      ++idx;
    }
    console.log("finished adding words");
  }

  async createGrammarFromJSGF(jsgf: string) {
    await this.decoder.set_jsgf(jsgf);
    console.log("finished creating grammar");
  }

  async createGrammar$(jsgf: string, dict: any) {
    /* Reinitialize decoder for new dictionary and grammar */
    await this.decoder.initialize();
    await this.addDict(dict);
    console.log("Added words to dictionary");
    await this.createGrammarFromJSGF(jsgf);
    console.log("Added grammar");
    console.log("Grammar ready.");
  }

  async align$(audio: any, text: string) {
    if (this.decoder.get_config("samprate") != audio.sampleRate) {
      this.decoder.set_config("samprate", audio.sampleRate);
      await this.decoder.reinitialize_audio();
      console.log(
        "Updated decoder sampling rate to " +
          this.decoder.get_config("samprate")
      );
    }
    console.log("Audio sampling rate is " + audio.sampleRate);
    await this.decoder.start();
    /* FIXME: Decompose this to allow progress bar, non-blocking of
     * long files (requires API for separate CMN) */
    await this.decoder.process(audio.getChannelData(0), false, true);
    await this.decoder.stop();
    const e = this.decoder.get_hypseg();
    console.log(e);
    return e;
  }
}
