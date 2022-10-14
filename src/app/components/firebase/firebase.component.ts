import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ResolveEnd } from '@angular/router';

type PicsumObject = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

@Component({
  selector: 'app-firebase',
  templateUrl: './firebase.component.html',
  styleUrls: ['./firebase.component.css'],
})
export class FirebaseComponent implements OnInit {
  constructor(private afs: AngularFirestore) {}

  unsubscribeFromCollection: any;
  images: any = [];

  ngOnInit(): void {
    this.createRandomDocumentByCollection('images');

    // listen to collection changes
    this.getCollectionInRealTime('images');
  }

  createRandomDocumentByCollection(collection: string) {
    // Fetch the JSON.
    fetch('https://picsum.photos/v2/list#')
      .then((res) => res.json())
      .then((res: PicsumObject[]) => {
        for (let i = 0; i < 10; i++) {
          const randomNum = Math.floor(Math.random() * res.length);
          this.afs
            .collection(collection)
            .doc(res[randomNum].id)
            .set(res[randomNum]);
        }
      });
  }

  createDocumentByCollection(collection: string, argId: string): void {
    // Fetch the JSON.
    fetch('https://picsum.photos/v2/list#')
      .then((res) => res.json())
      .then((res: PicsumObject[]) => {
        // Look for the object's ID.
        res.forEach((obj: PicsumObject) => {
          console.log(JSON.stringify(obj));
          if (obj.id == argId) {
            this.afs
              .collection(collection)
              .doc(argId)
              .set(obj)
              .then((success) => {
                console.log(success);
              })
              .catch((error) => {
                console.log(error);
              });
            return;
          }
        });
      });
  }

  createDocumentByFullPath(
    pathToDocument: string,
    data: any,
    merge: boolean = true
  ): void {
    this.afs
      .doc(pathToDocument)
      .set(data, { merge: merge })
      .then((success) => {
        console.log(success);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Function auto-refreshes newly added information
  getCollectionInRealTime(collection: string) {
    this.unsubscribeFromCollection = this.afs
      .collection(collection)
      .ref.onSnapshot(
        (documents) => {
          this.images = [];
          documents.forEach((doc) => {
            this.images.push(doc.data());
            console.log(doc.data());
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
