import Heading from "@/app/_ui/Heading";
import styles from "./styles.module.css";
import Card from "../Card/Card";
import Image from "next/image";
import { getDictionary } from "@/app/_lib/i18n";
async function Blog() {
  const dict = (await getDictionary()).home;
  return (
    <section className={styles.blogSection}>
      <div className="container">
        <Heading className={styles.heading}>{dict.blog}</Heading>
        <p className={styles.description}>Lorem Ipsum is available, but the majority have suffered</p>

        <div className={styles.blogGrid}>
          <Card>
            <Card.Thumbnail>
              <Image fill src="/bg.png" alt="" />
            </Card.Thumbnail>
            <Card.Description className={styles.blogDescriptionContainer}>
              <h2 className={styles.blogHeading}>{dict.bedRoom}</h2>
              <p className={styles.blogLabel}>{dict.standardChunk}</p>
              <p className={styles.blogDescription}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae veniam fugiat vero nesciunt iste laborum
                pariatur voluptatum sed. Cumque nulla officiis repellendus dolorum fugit et dolores doloribus. Earum,
                est quo!
              </p>
            </Card.Description>
          </Card>
          <Card>
            <Card.Thumbnail>
              <Image fill src="/bg.png" alt="" />
            </Card.Thumbnail>
            <Card.Description className={styles.blogDescriptionContainer}>
              <h2 className={styles.blogHeading}>{dict.bedRoom}</h2>
              <p className={styles.blogLabel}>{dict.standardChunk}</p>
              <p className={styles.blogDescription}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae veniam fugiat vero nesciunt iste laborum
                pariatur voluptatum sed. Cumque nulla officiis repellendus dolorum fugit et dolores doloribus. Earum,
                est quo!
              </p>
            </Card.Description>
          </Card>

          <Card>
            <Card.Thumbnail>
              <Image fill src="/bg.png" alt="" />
            </Card.Thumbnail>
            <Card.Description className={styles.blogDescriptionContainer}>
              <h2 className={styles.blogHeading}>{dict.bedRoom}</h2>
              <p className={styles.blogLabel}>{dict.standardChunk}</p>
              <p className={styles.blogDescription}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae veniam fugiat vero nesciunt iste laborum
                pariatur voluptatum sed. Cumque nulla officiis repellendus dolorum fugit et dolores doloribus. Earum,
                est quo!
              </p>
            </Card.Description>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Blog;
