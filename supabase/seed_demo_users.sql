-- Oldify: 36 comptes test (même mot de passe: OldifyDemo123!)
-- Exécuter dans Supabase → SQL Editor
-- Emails réalistes (Gmail, Outlook, Yahoo, etc.) — exemples: ahmed.elamiri@gmail.com … sara.bennani@yahoo.fr
-- NB: ce sont des adresses de démo (pas forcément des boîtes actives).

WITH ins AS (
  INSERT INTO public.app_users (email, password_hash, full_name)
VALUES
  ('ahmed.elamiri@gmail.com', '043758ead5a81b8f1b81ce8c16f5273a:04148f3fecc7dfffa81de25b25bf74b2bf67818410e2b5859f32f60cdd70f7a9e9c9989fdff9ce17bac581b9370139141c1f588765aceb35feebc9b80a794711', 'Ahmed El Amiri'),
  ('fatima.zahra.alaoui@outlook.com', '6422a87c88250e8e3faa4c45ac34806b:35904abd656415a7255de79f3ff38eafa02976f79f294bab3259048569414c462e9789b8e77a4f9be3cfa1b5a11cd291276805389c0935b6028fc2fa9c018793', 'Fatima Zahra Alaoui'),
  ('yasmine.benkirane@gmail.com', '3ca7358b8d756cdae8ae2402cdaf2709:161afda0b168e0c8c8b13167fb63cae5d400a95f431cb575faaf7e84ddb541070d170bbaa24301cc5cc2e611e93e527d46cc2ca2e6933966ccc501157aa22e6a', 'Yasmine Benkirane'),
  ('omar.idrissi@gmail.com', '80aca7accdddf572ea717d7445a6cc05:1baf0326fd227fcc4b797660679acdae8f0269d32997860ccacc746d44a16725a690e72f5d3dec412e23effb2e18ba4a3253e4657209807bdc4f2d5c3df79a9a', 'Omar Idrissi'),
  ('salma.chraibi@yahoo.fr', 'e7bacd875ac3084106e9b7cff1ba84ae:49d37a59e8a103a1b18498fdd44cf71953ee09b8c0a12ce0eb86e9bda344e1521aa81d2f768529701dd236eee559bac9ab4c2cde0e0c10f16a1b256a75ff1c5e', 'Salma Chraibi'),
  ('mehdi.tazi@hotmail.fr', 'bcd112093570d917952f2709622e7b4a:b8d437d22c0f40ed9bebd8cf528806b9d7add7a8cd0a4cb06e6591cc4fdec31cde0826a983552f754cdacf49ab7b236bffd5d39c502be0feb8ac083d1da774b8', 'Mehdi Tazi'),
  ('imane.merzouk@gmail.com', '0c5589e15e772b0289c26f857e667370:785eb127278185b4aed1900e49c9cd33c67292379208130b599406efc8942aa22297558c04b2c85ece8bb06e99f23f0f932c85c5691f2be1e77cf1af1c270572', 'Imane Merzouk'),
  ('karim.fassi@outlook.com', 'a299b3b066c5009a54e746822be52850:2300f6a686efec89a2950535c0457e5930fb51cf6ec1fc1cb3d66e34eeab36f002f074cd274e1d50139d85800045c297dad51526258c84a18bf3ba16ff090d1d', 'Karim Fassi'),
  ('layla.ouazzani@gmail.com', '5a78f5fe064b2ccf074039ef7df5b867:e4570bf424e9dd646943a872267c619e4500584859b6c7a6f26fe4e1ebef1085be47950a1e1a5bbfda767d63b5d740c0c1c6f74d4a604d278cf4d32b1d250775', 'Layla Ouazzani'),
  ('bilal.saidi@gmail.com', 'e9d7356fb44b1894410e605cdfa3e227:3f20a59ceaaf7736f76f6dbda26523c66628aac1bbb29aac2bee5a8d9b33ffed49c967b6a1f4aa042f84524ff89affc89fdd607d7a8bf53e01c5a7ce0d7d6805', 'Bilal Saidi'),
  ('houda.amrani@yahoo.fr', 'fd02f9748284e798d767268a221a7fc9:b850a502b9f6a6defe120b7009d101dbd9907a2682c08a674e2889c66d264465bdefd03b27a5a841a8bafe140d5bbb5f2a06311cc2e695418471c29756892cff', 'Houda Amrani'),
  ('rachid.berrada@gmail.com', '89d78e833b9a05e57f6fd7db76420991:62aa8d041b553f285e30fb4a4d6c639f854cde35a6fa91c503a52b1a8c87c5a5bcf18e31ecf6e015bf52fc67e6b35e7cc41b107220c5697861f342638b1f33bf', 'Rachid Berrada'),
  ('nadia.kettani@outlook.com', 'c0963c0b8d982ee720939447e9f0fc58:e249247f082436e44fcba5b4b279f1119e4d755d8c9c041c04d0b82719532a2dab1d402b8b3b907513f70bd5d0b457343c717cc6994d6ca0cd5fb806dd0f318f', 'Nadia Kettani'),
  ('anas.chaoui@gmail.com', '3508b9c08a2e089588ff107bc291a1b9:a150aa029763204215e6a0795da52750c2f2422bb15cb09484ca808370198fba04d7c3d7d2b6aa727d0cb2892b91a8f609f04091b0aae8297007209bd5bdaaa0', 'Anas Chaoui'),
  ('soukaina.elfilali@gmail.com', 'f87af7afa2e4ef71d34dc02fc44f674a:c5cd182dc37da469a56769189efc586bde6a0810148562fe07452ec3e95fa4ed871c1a5bd27a2552fcb2425c601ce9b73f9b304f8704c0dcf581acfe3ab88c35', 'Soukaina El Filali'),
  ('hamza.mourabit@hotmail.fr', '1823fd7d14741ce9d33ea5c9b72d9055:4f84cdaefc39833b4292f2bfb752eae8e30fb2717c83ac028685c6672d636d745c1199ed5467af69e6206b000b74808ad54b1ee3a5628974c734843a0400df07', 'Hamza Mourabit'),
  ('kawtar.benani@gmail.com', '5d412d7083a9682e73b99e9a84b760f2:437407c3b0baa0cfc8799e218d69faf14e09e55144bee85135b63a410592b90e844dd7111ab300e1173cb02baa3601391537691476b3bccfa4a85720d3a827f1', 'Kawtar Benani'),
  ('redouane.jabri@gmail.com', '151481da0c0bbe6dcb78642ab9ebcdc6:75e8e82360d6893f0a0caea31cb385980edd39627e04ed0c4247961e486b4ff28c37f000a7bc2e1b0c39cc254836c090608cc95c11f7e2411f52cfae40591fe0', 'Redouane Jabri'),
  ('meryem.lahlou@gmail.com', '8865fcb2ee487771462238e1b16b4aa5:3601d57ba512bd227096a9e190edce78c9f78ba85a4b2075054176aad3b4f50415eaaf39eaf3ce8527bf1c34627a00bf88e50da8e557f32132981d3a6aa999da', 'Meryem Lahlou'),
  ('oussama.dahbi@outlook.com', 'f11652d51d6fc188f69a8f2c728f0bdb:d64f82292ef309044f9720ddc3eda30440bc206498bd9ac62c1b78078b24085816aeb11f6ba9ac114abeb04c82b84e13ddc7cdcf0bf8ae7284b5c7279bbe8a2f', 'Oussama Dahbi'),
  ('siham.tadlaoui@gmail.com', 'd838ba1e52337ec98d6385e53002db53:5d7d3d3ecc9db28bf087fa86f16c863a0151133ab0deca05d9f5cec2c43157c42c8f61d449468352f6fa93ae81d0feb61c50aefe7dfddc014abdf0280b37d4a3', 'Siham Tadlaoui'),
  ('adnane.rifi@gmail.com', '679e0ca94e4edee06826e7d526b57255:0520591786ab567541010b8436c85f9288b0745702aee0414379de4122a4885bd49619bfaec378cab439e8fbe8ee7f0bd06c3f5228283b8ab7a42398470aa145', 'Adnane Rifi'),
  ('khadija.ouriach@gmail.com', '2fd1983429d80c4ebb495b42b64be0e6:7bfcc40b7d2c6892949c503963cc23783f74876577344e4ba232ba452810d8246f5a098846dbbcbffe5e391e5010f558abf0972941531a391a84e491249b3981', 'Khadija Ouriach'),
  ('yassine.elhajji@gmail.com', 'e764b6626c320d69c2ebf0991af54231:0b25014fc37717d20195e5bff6b5daa3a632532d51be5e142f5406de0e18421105c612658b17ddd5d1a9863706005a214951fcec610373d5d97b18934c8afb5b', 'Yassine El Hajji'),
  ('hanane.bensouda@yahoo.fr', 'e2a665e2024b05ad00c6a7b507d628c2:864b7a7778bb58887c96ad49244ac2a9540711b6c365e93b3bab55c281e8f1a6a556fc9e186bef68af223dbf8b10c1fb8db4e3d49efe676a29e2c52ad54e84cc', 'Hanane Bensouda'),
  ('mouaad.charkaoui@gmail.com', 'fef00baae9312b2182c6a101a9136c2b:d72ea5fb8fecb5e0716a2f8742936705ee23f0c7ccac80692eee598777a59c30e935010ecc80526149d321ff80caba389f2cbb05461bc51fcf95d86f990debbd', 'Mouaad Charkaoui'),
  ('rajae.mansouri@gmail.com', 'f061e0e3e7ab37753350b6d3be5e1ac3:2a9a769d00200c66d0f561ea8f1b1e3d1de3e46d4a1943514ac4c2b030eed135b4399c471d3052eff272d0e483c4b69c28a6d3ad2d8af7109a5cde031ab15c75', 'Rajae Mansouri'),
  ('walid.tazi@gmail.com', '9e93aaa2d0d1ac2aa8b877aaf26b3ee5:484fd0eb047df1338ac62eb4882229edbdd3beec680b7eb90a1ea2e41f2474833017746b6a429c714559862caa18594c2cda6be0fd16b7380ecfec85cb973cd9', 'Walid Tazi'),
  ('douaa.safi@gmail.com', 'ed0248426c4c1e539cc26564e4795d22:3cfc76c2a4560477eab4cfa28ab6aa6754da02295927c8cb8a1e1fb433583a4afb896f13bd463de9cebeecd9012bbf822ede7f8035d2ed68f46a7092e7038269', 'Douaa Safi'),
  ('amine.berrada@gmail.com', '244f023ec986f346e9fe87afc4e457bb:d8f63b34bc5a90df1d6155fe7dc170ef6b529395e6381ee9746d7b73d8abce90c385bcc7bcdd2e1d6baee33c7a2eb38b62ab822cdbca7813f7a6c64f9fa79181', 'Amine Berrada'),
  ('hicham.lazrak@gmail.com', '6389ee0e1bd294985c650a2f330932d0:8dfcff0e0bee1dcdf24e6d94fdf42d9109b4f095170ad3623454d3fa44aa09bccac1e9a972ca6523dc0f1e94e85e89679e6b0a485c2e33baf27d5c3759f9e09a', 'Hicham Lazrak'),
  ('zineb.ouali@icloud.com', '44209c2d0498ae4e526115c64b559778:f784b5a35690ddf54ebc2bd8d4d52afe70250998b763ee3fb23f540bdd64775823fc7d0a69d66970795c37e065b1441a42f4cdb4974aca8e6c9bc57e4f789982', 'Zineb Ouali'),
  ('tarik.benjelloun@gmail.com', '4211f6111fc12055c6b3151e88a1e813:2faf190f689fa3ac0cfe948b728c0d701bfec766846a102a9ab6707bb21931567e394edcc11cec63aaec5f33c76c1316bd217ed3805f8ce6c212e71c7dd518a7', 'Tarik Benjelloun'),
  ('hiba.chakir@outlook.com', '780ae19e0ac5a825aeeaf4c7a21c8be1:2497f4c12c49644072c2ab5d5eecaf1bfdd6ed2d774a566e0947cc1995270a5ec8cf5f349b4e5bea78527dd5c80d4d8bd7c4dd998f98f20ee43e498a119b51f1', 'Hiba Chakir'),
  ('mustapha.alaoui@gmail.com', 'cf4cf2efecd5da00947cae09741c3d50:1d12ee46ee8cd3087e65ec21d906b211965f422f9ea904dbc902f916e191c872eb56e1507414563c22196a399799264d2a29c787b2cf8aa310b69706d48f9c96', 'Mustapha Alaoui'),
  ('sara.bennani@yahoo.fr', '9c648838fec918cf0b1854d5e0bcddc7:9b3baf1303e5aa45543cff8bd2bd5c573b3cbac58bda1f96e5be3c7f9b0d100182dc9e41922d5fac286444547a9a91efc6928c96a23e806deeb47e538b77cdc7', 'Sara Bennani')
  ON CONFLICT (email) DO NOTHING
  RETURNING id, email, full_name
)
INSERT INTO public.app_profiles (user_id, email, full_name)
SELECT id, email, full_name FROM ins
ON CONFLICT (user_id) DO NOTHING;
