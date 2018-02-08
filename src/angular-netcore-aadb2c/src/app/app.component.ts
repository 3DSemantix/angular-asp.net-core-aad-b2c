import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {

  constructor(private httpService: Http) { }

  apiValues: string[] = [];

  ngOnInit() {
    this.httpService.get("/api/secure").subscribe(values => {
      this.apiValues = values.json() as string[];
    });
  }
}
