package com.arthiksetu.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.os.Bundle;
import android.provider.Telephony;
import android.util.Log;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // This is the correct place to ask for SMS permission in a Capacitor app
    if (checkSelfPermission(Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED) {
      requestPermissions(new String[]{Manifest.permission.READ_SMS}, 101);
    } else {
      // If permission is already granted, read the SMS messages
      readSms();
    }
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    if (requestCode == 101 && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
      // If permission was granted from the popup, read the SMS messages
      readSms();
    } else {
      Log.e("ArthikSetu", "SMS Permission was denied.");
    }
  }

  private void readSms() {
    Log.d("ArthikSetu", "Permission granted. Starting to read SMS...");
    Cursor cursor = getContentResolver().query(
      Telephony.Sms.Inbox.CONTENT_URI,
      null,
      null,
      null,
      "date DESC" // Read newest messages first
    );

    if (cursor != null) {
      Log.d("ArthikSetu", "Found " + cursor.getCount() + " SMS messages.");
      while (cursor.moveToNext()) {
        try {
          // Get the message body
          String body = cursor.getString(cursor.getColumnIndexOrThrow("body"));
          
          // Log the body of each SMS to Logcat
          Log.d("SMS_BODY", body);

        } catch (Exception e) {
          Log.e("ArthikSetu", "Error reading a single SMS.", e);
        }
      }
      cursor.close();
      Log.d("ArthikSetu", "Finished reading SMS.");
    } else {
        Log.e("ArthikSetu", "Could not get SMS cursor. It is null.");
    }
  }
}